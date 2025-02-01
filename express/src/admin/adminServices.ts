import { encodeToken} from './../utils/index';
import AdminModel from "../models/adminModel";
import ReviewModel from "../models/reviewsModel";
import bcrypt from "bcrypt";
import ServerError from '../errors/serverError';
import LoginDto from "./dtos/loginDto";
// import SignupDto from './dtos/signupDto';
import { Request , Response , NextFunction } from "express";

import UsersModel from "../models/usersModel";
import UpdateUserDto from "./dtos/updateUserDto";

import { decodeToken } from "../utils";
import MoviesModel  from "../models/moviesModel";
import CreateMovieDto  from "../movie/dtos/movieCreateDto";


export const login = async  (data :LoginDto) =>{
    const user = await AdminModel.findOne({ where: { username: data.username } }); 
    if (!user) throw new ServerError(404 , "User not found")
    const compare = await bcrypt.compare(data.password , user.password)
    if (!compare) throw new ServerError(400 , "Invalid credentials")
    const token = encodeToken({id : user.id})
    return {admin_token : `${token}`}

}
// Get user list
export const getUsers = async () => {
    const users = await UsersModel.findAll({
        attributes: ["id", "name", "email", "createdAt", "updatedAt"], // Include only necessary fields
    });

    return users;
};

export const getUser = async (id: number) => {
    const user = await UsersModel.findByPk(id);
    if (!user) {
        throw new ServerError(404, "User not found.");
    }
    return user;
};
// Update user details
export const updateUser = async (id: number, data: UpdateUserDto) => {
    const user = await UsersModel.findByPk(id);

    if (!user) {
        throw new ServerError(404, "User not found.");
    }

    // Update the user's details
    await user.update(data);

    return user;
};

// Delete a user
export const deleteUser = async (id: number) => {
    const user = await UsersModel.findByPk(id);

    if (!user) {
        throw new ServerError(404, "User not found.");
    }
    // Delete the user (can also use soft delete if needed)
    await user.destroy();

    return { id };
};


// Get all reviews
export const getReviews = async () => {
    try {
        const reviews = await ReviewModel.findAll(); // Fetch all reviews from the database
        return reviews;
    } catch (error) {
        throw new ServerError(500, "Error fetching reviews.");
    }
};

// Get a single review by ID
export const getReviewById = async (id: number) => {
    try {
        const review = await ReviewModel.findByPk(id); // Fetch review by primary key (ID)
        if (!review) {
            throw new ServerError(404, "Review not found.");
        }
        return review;
    } catch (error) {
        throw new ServerError(500, "Error fetching the review.");
    }
};



export const deleteReview = async (id: number) => {
    try {
        const review = await ReviewModel.findByPk(id); // Find the review by ID
        if (!review) {
            throw new ServerError(404, "Review not found.");
        }

        const movie_id = review.movie_id; // Get the associated movie ID
        await review.destroy(); // Delete the review from the database

        // Recalculate the average rating for the movie
        const reviews = await ReviewModel.findAll({ where: { movie_id } });
        const newAvgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        // Update the movie rating
        await MoviesModel.update(
            { rate: newAvgRating },
            { where: { id: movie_id } }
        );

    } catch (error) {
        throw new ServerError(500, "Error deleting the review and updating movie rating.");
    }
};


export const updateMovie = async (movieId: number, data: Partial<CreateMovieDto>, token: string) => {
    const movie = await MoviesModel.findOne({ where: { id: movieId} });

    if (!movie) {
        throw new Error("Movie not found or you do not have permission to update it");
    }
    return await movie.update(data);
};

export const deleteMovie = async (movieId: number, token: string) => {
    const user = decodeToken(token); 

    // Find the movie to ensure it exists and belongs to the user
    const movie = await MoviesModel.findOne({ where: { id: movieId} });

    if (!movie) {
        throw new Error("Movie not found or you do not have permission to delete it");
    }
    await movie.destroy();
    return { message: "Movie deleted successfully" };
};
// export const signup = async (data: SignupDto) => {
  
//     const hashedPassword = await bcrypt.hash(data.password, 10);
//     const newUser = await AdminModel.create({...data , password : hashedPassword})
  
//     const token = encodeToken({id : newUser.id})
//     return {token : `${token}`}
//   };
