import { Router, Request, Response, NextFunction } from "express";
import {
    findFriendByEmail,
    findExistingRequest,
    createFriendRequest,
    getPendingFriendRequests,
    acceptFriendRequest,
} from "./friendServices";
import { decodeToken } from "../utils/index";
import logger from "../helper/logger";

const router = Router();

router.post("/add-friend", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }

        const user = decodeToken(token); // Decode user info from the token
        const { friend_email } = req.body;

        if (!friend_email) {
            res.status(400).json({ message: "Friend email is required." });
            return;
        }

        const friend = await findFriendByEmail(friend_email);

        if (friend.id === user.id) {
            res.status(400).json({ message: "You cannot send a friend request to yourself." });
            return;
        }

        const existingRequest = await findExistingRequest(user.id, friend.id);

        if (existingRequest) {
            if (existingRequest.status === "A") {
                res.status(400).json({ message: "The user is already your friend." });
            } else if (existingRequest.status === "W") {
                res.status(400).json({ message: "Friend request is already pending." });
            }
            return;
        }

        const newFriendRequest = await createFriendRequest(user.id, friend.id);

        res.status(201).json({ message: "Friend request sent.", request: newFriendRequest });
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

router.get("/friend-requests", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }

        const user = decodeToken(token);
        const requests = await getPendingFriendRequests(user.id);

        res.status(200).json({ message: "Friend requests fetched successfully.", requests });
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

router.put("/accept-friend", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }

        const user = decodeToken(token);
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: "Email is required." });
            return;
        }

        const friend = await findFriendByEmail(email);

        const friendRequest = await acceptFriendRequest(friend.id, user.id);

        res.status(200).json({ message: "Friend request accepted.", friendRequest });
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

export default router;
