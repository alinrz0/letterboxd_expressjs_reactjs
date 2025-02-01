import { Router, Request, Response, NextFunction } from "express";
import { getUserFromToken } from "./profileServices";
import logger from "../helper/logger";

import UserModel from "../models/usersModel";
import ReviewModel from "../models/reviewsModel";
import MovieModel from "../models/moviesModel"; // Assuming you have a movies model

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;

        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }

        const user = getUserFromToken(token);

        try {
            // Find the user in the database
            const userProfile = await UserModel.findOne({
                where: { id: user.id },
                attributes: ["id", "name", "email", "createdAt"],
            });

            if (!userProfile) {
                res.status(404).json({ message: "User profile not found." });
                return;
            }

            // Fetch all reviews by the user
            const userReviews = await ReviewModel.findAll({
                where: { user_id: user.id },
                attributes: ["movie_id", "review", "rating", "createdAt"],
            });

            // Manually fetch movie details for each review
            const reviewsWithMovies = await Promise.all(
                userReviews.map(async (review) => {
                    const movie = await MovieModel.findOne({
                        where: { id: review.movie_id },
                        attributes: ["title", "year", "poster"],
                    });

                    return {
                        movie_id:review.movie_id,
                        title: movie?.title || "Unknown Title",
                        year: movie?.year || "Unknown Year",
                        poster: movie?.poster || "No Poster Available",
                        review: review.review,
                        rating: review.rating,
                    };
                })
            );

            res.status(200).json({
                message: "Profile and reviews fetched successfully.",
                profile: userProfile,
                reviews: reviewsWithMovies,
            });
        } catch (error) {
            console.error("Error fetching profile or reviews:", error);
            res.status(500).json({ message: "Error fetching profile or reviews." });
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

export default router;
