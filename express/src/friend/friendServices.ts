import { Op } from "sequelize";
import FriendModel from "../models/friendsModel";
import UserModel from "../models/usersModel";
import { decodeToken } from "../utils/index";

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

// Check if a friend exists by email
export const findFriendByEmail = async (friend_email: string) => {
    const friend = await UserModel.findOne({ where: { email: friend_email } });
    if (!friend) {
        throw new Error("Friend with this email not found.");
    }
    return friend;
};


export const findExistingRequest = async (user_id: number, friend_id: number) => {
    const existingRequests = await FriendModel.findAll({
        where: {
            user_id: user_id,
            friend_id: friend_id,
        },
    });

    // Filter results based on status
    const acceptedRequest = existingRequests.find((req) => req.status === "A");
    const pendingRequest = existingRequests.find((req) => req.status === "W");

    // Return the most relevant request or null if none matches
    if (acceptedRequest) {
        return { status: "A", request: acceptedRequest };
    }
    if (pendingRequest) {
        return { status: "W", request: pendingRequest };
    }

    return null; // No relevant requests found
};


export const createFriendRequest = async (user_id: number, friend_id: number) => {
    const existingRequest = await FriendModel.findOne({
        where: {
            user_id,
            friend_id,
        },
    });

    if (existingRequest) {
        // Update the status to "W" if a request exists
        await existingRequest.update({ status: "W" });
        return existingRequest;
    } else {
        // Create a new request if none exists
        const newFriendRequest = await FriendModel.create({
            user_id,
            friend_id,
            status: "W", // Waiting
        });
        return newFriendRequest;
    }
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

export const rejectFriendRequest = async (friend_id: number, user_id: number) => {
    const friendRequest = await FriendModel.findOne({
        where: { user_id: friend_id, friend_id: user_id, status: "W" },
    });

    if (!friendRequest) {
        throw new Error("Friend request not found.");
    }

    friendRequest.status = "R"; // Accepted
    await friendRequest.save();
    return friendRequest;
};

export const getFollowers = async (userId: number) => {
    const followers = await FriendModel.findAll({
        where: {
            friend_id: userId,
            status: "A",
        },
        include: {
            model: UserModel,
            as: "follower",
            attributes: ["id", "name", "email"],
        },
    });
    return followers.map((follower) => ({
        id: follower.id,
        name: follower.follower?.name,
        email: follower.follower?.email,
    }));
};

export const getFollowing = async (userId: number) => {
    const following = await FriendModel.findAll({
        where: {
            user_id: userId,
            status: "A",
        },
        include: {
            model: UserModel,
            as: "following",
            attributes: ["id", "name", "email"],
        },
    });

    return following.map((followedUser) => ({
        id: followedUser.id,
        name: followedUser.following?.name,
        email: followedUser.following?.email,
    }));
};

export const deleteFollower = async (userId: number, email: string) => {
    // Find the user by email
    const follower = await UserModel.findOne({ where: { email } });

    if (!follower) {
        throw new Error("User with the provided email not found.");
    }

    // Check if the connection exists where the user is the friend_id (follower)
    const connection = await FriendModel.findOne({
        where: {
            status: "A",
            user_id: follower.id, // Follower's user ID
            friend_id: userId,    // Current user's ID
        },
    });

    if (!connection) {
        throw new Error("Follower connection not found.");
    }

    // Mark the connection as deleted
    connection.status = "D";
    await connection.save();

    return { message: "Follower connection deleted successfully." };
};

export const deleteFollowing = async (userId: number, email: string) => {
    // Find the user by email
    const following = await UserModel.findOne({ where: { email } });

    if (!following) {
        throw new Error("User with the provided email not found.");
    }

    // Check if the connection exists where the user is the user_id (following)
    const connection = await FriendModel.findOne({
        where: {
            status: "A",
            user_id: userId,        // Current user's ID
            friend_id: following.id, // Following's user ID
        },
    });

    if (!connection) {
        throw new Error("Following connection not found.");
    }

    // Mark the connection as deleted
    connection.status = "D";
    await connection.save();

    return { message: "Following connection deleted successfully." };
};

export const getFollowersOfFriend = async (userId: number, email: string) => {
    // Find the user by email
    const friend = await UserModel.findOne({ where: { email } });

    if (!friend) {
        throw new Error("User with the provided email not found.");
    }
            
    // Check if the logged-in user is following the friend
    const isFollowing = await FriendModel.findOne({
        where: {
            user_id: userId,
            friend_id: friend.id,
            status: "A", // Must be an active following relationship
        },
    });

    if (!isFollowing) {
        throw new Error("You are not following this user.");
    }

    // Get followers of the friend
    const followers = await FriendModel.findAll({
        where: {
            friend_id: friend.id,
            status: "A", // Only active followers
        },
        include: [
            {
                model: UserModel,
                as: "follower",
                attributes: ["id", "name", "email"],
            },
        ],
    });

    return followers.map((follower) => ({
        id: follower.user_id,
        name: follower.follower?.name,
        email: follower.follower?.email,
    }));
};


export const getFollowingOfFriend = async (userId: number, email: string) => {
    // Find the user by email
    const friend = await UserModel.findOne({ where: { email } });

    if (!friend) {
        throw new Error("User with the provided email not found.");
    }

    // Check if the logged-in user is following the friend
    const isFollowing = await FriendModel.findOne({
        where: {
            user_id: userId,
            friend_id: friend.id,
            status: "A", // Active following relationship
        },
    });

    if (!isFollowing) {
        throw new Error("You are not following this user.");
    }

    // Get the following list of the friend
    const following = await FriendModel.findAll({
        where: {
            user_id: friend.id, // friend is following someone
            status: "A", // Only active following relationships
        },
        include: [
            {
                model: UserModel,
                as: "following", // The friend being followed by the specified user
                attributes: ["id", "name", "email"],
            },
        ],
    });

    return following.map((follow) => ({
        id: follow.friend_id,
        name: follow.following?.name,
        email: follow.following?.email,
    }));
};



export const deleteFriendRequestByIds = async (user_id: number, friend_id: number) => {
  try {
    // Find the existing friend request between the two users
    const friendRequest = await FriendModel.findOne({
      where: {
        [Op.or]: [
          { user_id, friend_id },
          { user_id: user_id, friend_id: friend_id },
        ],
      },
    });

    if (!friendRequest) {
      throw new Error('No pending friend request to delete.');
    }

    console.log(friendRequest)
    // Check if the status is 'W' (waiting), meaning it's a pending request
    if (friendRequest.status !== 'W') {
      throw new Error('You can only delete pending friend requests.');
    }
    console.log(1)
    // Delete the pending friend request
    await friendRequest.destroy();

    console.log('Friend request deleted successfully.');
    return { message: 'Friend request deleted successfully.' };

  } catch (error) {
    console.error('Error deleting friend request:', error);
    throw error;
  }
};
