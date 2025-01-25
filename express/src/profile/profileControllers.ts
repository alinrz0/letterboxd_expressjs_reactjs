import { Router, Request, Response, NextFunction } from "express";
import { getUserFromToken} from "./profileServices";
import logger from "../helper/logger";

import UserModel from "../models/usersModel";
import ReviewModel from "../models/reviewsModel";
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
                attributes: ["id", "name", "email", "createdAt"], // Customize the fields as needed
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

            res.status(200).json({
                message: "Profile and reviews fetched successfully.",
                profile: userProfile,
                reviews: userReviews,
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching profile or reviews." });
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
});


export default router;
