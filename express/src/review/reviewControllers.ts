import { Router, Request, Response, NextFunction } from "express";
import ValidateMiddleware from "../middlewares/validateMiddleware";
import CreateReviewDto from "./dtos/createReviewDto";
import { addReview } from "./reviewServices";
import logger from "../helper/logger";

const router = Router();

router.post(
    "/review",
    ValidateMiddleware(CreateReviewDto),
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

export default router;
