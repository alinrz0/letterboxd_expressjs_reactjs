import { Router, Request, Response, NextFunction } from "express";
import {
    findFriendByEmail,
    findExistingRequest,
    createFriendRequest,
    getPendingFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    getUserFromToken,
    getFollowers,
    getFollowing,
    deleteFollower,
    deleteFollowing,
    getFollowersOfFriend,
    getFollowingOfFriend,
    deleteFriendRequestByIds
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


router.put("/reject-friend", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

        const friendRequest = await rejectFriendRequest(friend.id, user.id);

        res.status(200).json({ message: "Friend request rejected.", friendRequest });
    } catch (error) {
        logger.error(error);
        next(error);
    }
});



router.get("/followers", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;

        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }

        const user = getUserFromToken(token);
        const followers = await getFollowers(user.id);
        res.status(200).json({
            message: "Followers fetched successfully.",
            followers,
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

// Get Following
router.get("/following", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;

        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }

        const user = getUserFromToken(token);
        const following = await getFollowing(user.id);

        res.status(200).json({
            message: "Following fetched successfully.",
            following,
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

// Delete a Follower
router.put("/delete-connection/follower", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;

        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }

        const user = getUserFromToken(token);
        const { email } = req.query;

        if (!email) {
            res.status(400).json({ message: "Email query parameter is required." });
            return;
        }

        const result = await deleteFollower(user.id, email as string);

        res.status(200).json(result);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

// Delete a Following
router.put("/delete-connection/following", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;

        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }

        const user = getUserFromToken(token);
        const { email } = req.query;

        if (!email) {
            res.status(400).json({ message: "Email query parameter is required." });
            return;
        }

        const result = await deleteFollowing(user.id, email as string);

        res.status(200).json(result);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

router.get("/followers-of", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;

        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }

        const user = getUserFromToken(token);
        const { email } = req.query;
        if (!email) {
            res.status(400).json({ message: "Email query parameter is required." });
            return;
        }

        try {
            const followers = await getFollowersOfFriend(user.id, email as string);
            res.status(200).json({ message: "Followers fetched successfully.", followers });
        } catch (error) {
            res.status(403).json({ message: error });
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

router.get("/following-of", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;

        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }

        const user = getUserFromToken(token); // Decode user from token
        const { email } = req.query;

        if (!email) {
            res.status(400).json({ message: "Email query parameter is required." });
            return;
        }

        try {
            const following = await getFollowingOfFriend(user.id, email as string);
            res.status(200).json({ message: "Following list fetched successfully.", following });
        } catch (error) {
            res.status(403).json({ message: error });
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
});


router.get("/request-status", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token?.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }

        const user = decodeToken(token); // Decode user info from the token
        const { email } = req.query;

        if (!email || typeof email !== "string") {
            res.status(400).json({ message: "Email is required." });
            return;
        }

        const friend = await findFriendByEmail(email);
        const existingRequest = await findExistingRequest(user.id, friend.id);

        if (existingRequest) {
            res.status(200).json({ status: existingRequest.status }); // Returns 'A' (Accepted), 'W' (Waiting), or 'none'4
            return;
        }

        res.status(200).json({ status: 'none' }); // No request found
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

// Endpoint to delete a friend request
router.delete("/delete-request", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        const existingRequest = await findExistingRequest(user.id, friend.id);

        if (!existingRequest) {
            res.status(400).json({ message: "No pending friend request to delete." });
            return;
        }

        if (existingRequest.status !== "W") {
            res.status(400).json({ message: "You can only delete pending friend requests." });
            return;
        }

        await deleteFriendRequestByIds(user.id, friend.id); // Delete the request

        res.status(200).json({ message: "Friend request deleted." });
    } catch (error) {
        logger.error(error);
        next(error);
    }
});


export default router;
