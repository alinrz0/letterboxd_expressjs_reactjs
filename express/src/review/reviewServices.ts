import ReviewModel from "../models/reviewsModel";
import MoviesModel from "../models/moviesModel";
import { decodeToken } from "../utils/index";


import UserModel from "../models/usersModel";
import FriendModel from "../models/friendsModel";
import { Op } from "sequelize";

interface CreateReviewDto {
    movie_id: number;
    review: string;
    rating: number;
}

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

    // Return reviews along with the friend's name and email
    return {
        friendInfo: {
            name: friend.name,
            email: friend.email,
        },
        reviews,
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
