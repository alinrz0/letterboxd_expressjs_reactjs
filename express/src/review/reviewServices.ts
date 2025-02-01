import ReviewModel from "../models/reviewsModel";
import MoviesModel from "../models/moviesModel";
import { decodeToken } from "../utils/index";


import UserModel from "../models/usersModel";
import FriendModel from "../models/friendsModel";
import { Op, Sequelize } from "sequelize";

import CreateReviewDto from "./dtos/createReviewDto";

// reviewServices.ts

// Update Review
export const updateReview = async (token: string, updatedReviewDto: CreateReviewDto) => {
    const user = getUserFromToken(token);
    if (!user) throw new Error("User not found.");

    // Find the review by movie ID and user ID
    const review = await ReviewModel.findOne({ where: { movie_id: updatedReviewDto.movie_id, user_id: user.id } });
    if (!review) throw new Error("Review not found.");

    // Update the review
    review.review = updatedReviewDto.review;
    review.rating = updatedReviewDto.rating;
    await review.save();

    // Recalculate the average rating for the movie after the update
    const avgRatingResult = await ReviewModel.findAll({
        where: { movie_id: updatedReviewDto.movie_id },
        attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'avg_rating']],
    });

    // Extract avg_rating from the result and assert it as a number
    const avgRating = parseFloat(avgRatingResult[0].get('avg_rating') as string);

    // Update the movie's rating column with the new average rating
    await MoviesModel.update({ rate: avgRating }, { where: { id: updatedReviewDto.movie_id } });

    return review;
};


// Delete Review
export const deleteReview = async (token: string, movie_id: number) => {
    const user = getUserFromToken(token);
    if (!user) throw new Error("User not found.");

    // Find and delete the review
    const review = await ReviewModel.findOne({ where: { movie_id, user_id: user.id } });
    if (!review) throw new Error("Review not found.");

    await review.destroy();
    console.log(1)
    // Recalculate the average rating for the movie after the deletion
    const avgRatingResult = await ReviewModel.findAll({
        where: { movie_id },
        attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'avg_rating']],
    });
    
    let avgRating = 0;

    // If no reviews are left, set the rating to 0
    if (avgRatingResult.length > 0 && avgRatingResult[0].get('avg_rating') !== null) {
        avgRating = parseFloat(avgRatingResult[0].get('avg_rating') as string);
    }

    // Update the movie's rating column with the new average rating, or 0 if no reviews are left
    await MoviesModel.update({ rate: avgRating }, { where: { id: movie_id } });
};



export const checkExistingReview = async (token: string, movie_id: number) => {
    const user = decodeToken(token);
    if (!user || !user.id) {
        throw new Error("Invalid token payload.");
    }

    const existingReview = await ReviewModel.findOne({
        where: { user_id: user.id, movie_id },
    });

    return existingReview;
};

export const addReview = async (
    token: string,
    createReviewDto: CreateReviewDto
): Promise<object> => {
    // Decode user information from token
    const user = decodeToken(token);

    // Validate movie existence
    const movie = await MoviesModel.findByPk(createReviewDto.movie_id);
    if (!movie) {
        throw new Error("Movie not found.");
    }

    // Save the review
    const newReview = await ReviewModel.create({
        user_id: user.id,
        movie_id: createReviewDto.movie_id,
        review: createReviewDto.review,
        rating: createReviewDto.rating,
    });

    // Recalculate the average rating for the movie
    const avgRatingResult = await ReviewModel.findAll({
        where: { movie_id: createReviewDto.movie_id },
        attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'avg_rating']],
    });

    // Extract avg_rating from the result and assert it as a number
    const avgRating = parseFloat(avgRatingResult[0].get('avg_rating') as string);

    // Update the movie's rating column with the new average rating
    await MoviesModel.update({ rate: avgRating }, { where: { id: createReviewDto.movie_id } });

    // Return the new review
    return newReview;
};



// Fetch reviews if users are friends
export const getReviewsByFriendEmailWithInfo = async (user_id: number, friend_email: string) => {
    // Find the friend by email
    const friend = await UserModel.findOne({ where: { email: friend_email } });
    if (!friend) {
        throw new Error("User with this email not found.");
    }

    // Check if they are friends
    const isFriend = await FriendModel.findOne({
        where: {
            [Op.or]: [
                { user_id, friend_id: friend.id, status: "A" },
                { user_id: friend.id, friend_id: user_id, status: "A" },
            ],
        },
    });

    if (!isFriend) {
        throw new Error("You are not friends with this user.");
    }

    // Retrieve all reviews of the friend
    const reviews = await ReviewModel.findAll({
        where: { user_id: friend.id },
        attributes: ["movie_id", "review", "rating", "createdAt"],
    });

    // For each review, fetch the associated movie details
    const reviewsWithMovieDetails = await Promise.all(
        reviews.map(async (review) => {
            // Fetch movie details by movie_id
            const movie = await MoviesModel.findOne({
                where: { id: review.movie_id },
                attributes: ["title", "year", "poster"], // Fetch title, year, and poster of the movie
            });

            return {
                movie_id: review.movie_id,
                review: review.review,
                rating: review.rating,
                movie: movie ? {
                    title: movie.title,
                    year: movie.year,
                    poster: movie.poster,
                } : null,
            };
        })
    );

    // Return reviews along with the friend's name, email, and movie information
    return {
        friendInfo: {
            name: friend.name,
            email: friend.email,
        },
        reviews: reviewsWithMovieDetails,
    };
};



export const getUserFromToken = (token: string) => {
    if (!token) {
        throw new Error("Token not found or invalid.");
    }

    const user = decodeToken(token);
    if (!user || !user.id) {
        throw new Error("Invalid token payload.");
    }

    return user;
};
