import FriendModel from "../models/friendsModel";
import UserModel from "../models/usersModel";
import { decodeToken } from "../utils/index";

// Check if a friend exists by email
export const findFriendByEmail = async (friend_email: string) => {
    const friend = await UserModel.findOne({ where: { email: friend_email } });
    if (!friend) {
        throw new Error("Friend with this email not found.");
    }
    return friend;
};

// Check if a friend request already exists
export const findExistingRequest = async (user_id: number, friend_id: number) => {
    const existingRequest = await FriendModel.findOne({
        where: { user_id, friend_id },
    });
    return existingRequest;
};

// Create a new friend request
export const createFriendRequest = async (user_id: number, friend_id: number) => {
    const newFriendRequest = await FriendModel.create({
        user_id,
        friend_id,
        status: "W", // Waiting
    });
    return newFriendRequest;
};

// Get pending friend requests with sender details
export const getPendingFriendRequests = async (user_id: number) => {
    const requests = await FriendModel.findAll({
        where: { friend_id: user_id, status: "W" },
    });

    // Map requests to include sender details
    const enrichedRequests = await Promise.all(
        requests.map(async (request) => {
            const sender = await UserModel.findByPk(request.user_id, {
                attributes: ["email", "name"],
            });
            return {
                id: request.id,
                senderEmail: sender?.email,
                senderName: sender?.name,
            };
        })
    );

    return enrichedRequests;
};

// Accept a friend request
export const acceptFriendRequest = async (friend_id: number, user_id: number) => {
    const friendRequest = await FriendModel.findOne({
        where: { user_id: friend_id, friend_id: user_id, status: "W" },
    });

    if (!friendRequest) {
        throw new Error("Friend request not found.");
    }

    friendRequest.status = "A"; // Accepted
    await friendRequest.save();
    return friendRequest;
};
