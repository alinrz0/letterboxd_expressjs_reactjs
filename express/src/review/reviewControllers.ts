import { Router, Request, Response, NextFunction } from "express";
import ValidateMiddleware from "../middlewares/validateMiddleware";
import CreateReviewDto from "./dtos/createReviewDto";
import { 
    addReview,
    getReviewsByFriendEmailWithInfo,
    getUserFromToken,
    checkExistingReview,
    updateReview,      // New service for updating a review
    deleteReview       // New service for deleting a review
} from "./reviewServices";
import logger from "../helper/logger";

const router = Router();

// POST: Add a new review
router.post(
    "/review",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.cookies.token?.token;

            if (!token) {
                res.status(401).json({ message: "Token not found or invalid" });
                return;
            }

            const movie_id = parseInt(req.query.movie_id as string);
            if (isNaN(movie_id)) {
                res.status(400).json({ message: "Movie ID must be a valid number." });
                return;
            }

            const createReviewDto: CreateReviewDto = {
                ...req.body,
                movie_id, // Combine movie_id from query
            };

            // Check if the user has already reviewed the movie
            const existingReview = await checkExistingReview(token, movie_id);
            if (existingReview) {
                res.status(400).json({
                    message: "You have already submitted a review for this movie.",
                });
                return;
            }

            // Add the review
            const newReview = await addReview(token, createReviewDto);

            res.status(201).json({
                message: "Review submitted successfully.",
                review: newReview,
            });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
);

// PUT: Update a review
router.put(
    "/review",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.cookies.token?.token;

            if (!token) {
                res.status(401).json({ message: "Token not found or invalid" });
                return;
            }

            const movie_id = parseInt(req.query.movie_id as string);
            if (isNaN(movie_id)) {
                res.status(400).json({ message: "Movie ID must be a valid number." });
                return;
            }

            const updateReviewDto: CreateReviewDto = {
                ...req.body,
                movie_id, // Combine movie_id from query
            };

            // Check if the review exists for the current user
            const existingReview = await checkExistingReview(token, movie_id);
            if (!existingReview) {
                res.status(404).json({ message: "Review not found for this movie." });
                return;
            }

            // Update the review
            const updatedReview = await updateReview(token, updateReviewDto);

            res.status(200).json({
                message: "Review updated successfully.",
                review: updatedReview,
            });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
);

// DELETE: Delete a review
router.delete(
    "/review",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.cookies.token?.token;

            if (!token) {
                res.status(401).json({ message: "Token not found or invalid" });
                return;
            }

            const movie_id = parseInt(req.query.movie_id as string);
            if (isNaN(movie_id)) {
                res.status(400).json({ message: "Movie ID must be a valid number." });
                return;
            }

            // Check if the review exists for the current user
            const existingReview = await checkExistingReview(token, movie_id);
            if (!existingReview) {
                res.status(404).json({ message: "Review not found for this movie." });
                return;
            }

            // Delete the review
            await deleteReview(token, movie_id);

            res.status(200).json({
                message: "Review deleted successfully.",
            });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
);

// GET: Fetch reviews by a friend's email
router.get("/review", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;

        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }

        const user = getUserFromToken(token); // Use the getUserFromToken service
        const { email } = req.query;

        if (!email) {
            res.status(400).json({ message: "Email query parameter is required." });
            return;
        }

        try {
            const { reviews, friendInfo } = await getReviewsByFriendEmailWithInfo(user.id, email as string);
            res.status(200).json({
                message: "Reviews fetched successfully.",
                friend: friendInfo,
                reviews,
            });
        } catch (error) {
            res.status(403).json({ message: error });
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

export default router;
