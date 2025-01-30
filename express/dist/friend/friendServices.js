"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowingOfFriend = exports.getFollowersOfFriend = exports.deleteFollowing = exports.deleteFollower = exports.getFollowing = exports.getFollowers = exports.rejectFriendRequest = exports.acceptFriendRequest = exports.getPendingFriendRequests = exports.createFriendRequest = exports.findExistingRequest = exports.findFriendByEmail = exports.getUserFromToken = void 0;
const friendsModel_1 = __importDefault(require("../models/friendsModel"));
const usersModel_1 = __importDefault(require("../models/usersModel"));
const index_1 = require("../utils/index");
const getUserFromToken = (token) => {
    if (!token) {
        throw new Error("Token not found or invalid.");
    }
    const user = (0, index_1.decodeToken)(token);
    if (!user || !user.id) {
        throw new Error("Invalid token payload.");
    }
    return user;
};
exports.getUserFromToken = getUserFromToken;
// Check if a friend exists by email
const findFriendByEmail = (friend_email) => __awaiter(void 0, void 0, void 0, function* () {
    const friend = yield usersModel_1.default.findOne({ where: { email: friend_email } });
    if (!friend) {
        throw new Error("Friend with this email not found.");
    }
    return friend;
});
exports.findFriendByEmail = findFriendByEmail;
const findExistingRequest = (user_id, friend_id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRequests = yield friendsModel_1.default.findAll({
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
});
exports.findExistingRequest = findExistingRequest;
// Create a new friend request
const createFriendRequest = (user_id, friend_id) => __awaiter(void 0, void 0, void 0, function* () {
    const newFriendRequest = yield friendsModel_1.default.create({
        user_id,
        friend_id,
        status: "W", // Waiting
    });
    return newFriendRequest;
});
exports.createFriendRequest = createFriendRequest;
// Get pending friend requests with sender details
const getPendingFriendRequests = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const requests = yield friendsModel_1.default.findAll({
        where: { friend_id: user_id, status: "W" },
    });
    // Map requests to include sender details
    const enrichedRequests = yield Promise.all(requests.map((request) => __awaiter(void 0, void 0, void 0, function* () {
        const sender = yield usersModel_1.default.findByPk(request.user_id, {
            attributes: ["email", "name"],
        });
        return {
            id: request.id,
            senderEmail: sender === null || sender === void 0 ? void 0 : sender.email,
            senderName: sender === null || sender === void 0 ? void 0 : sender.name,
        };
    })));
    return enrichedRequests;
});
exports.getPendingFriendRequests = getPendingFriendRequests;
// Accept a friend request
const acceptFriendRequest = (friend_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const friendRequest = yield friendsModel_1.default.findOne({
        where: { user_id: friend_id, friend_id: user_id, status: "W" },
    });
    if (!friendRequest) {
        throw new Error("Friend request not found.");
    }
    friendRequest.status = "A"; // Accepted
    yield friendRequest.save();
    return friendRequest;
});
exports.acceptFriendRequest = acceptFriendRequest;
const rejectFriendRequest = (friend_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const friendRequest = yield friendsModel_1.default.findOne({
        where: { user_id: friend_id, friend_id: user_id, status: "W" },
    });
    if (!friendRequest) {
        throw new Error("Friend request not found.");
    }
    friendRequest.status = "R"; // Accepted
    yield friendRequest.save();
    return friendRequest;
});
exports.rejectFriendRequest = rejectFriendRequest;
const getFollowers = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const followers = yield friendsModel_1.default.findAll({
        where: {
            friend_id: userId,
            status: "A",
        },
        include: {
            model: usersModel_1.default,
            as: "follower",
            attributes: ["id", "name", "email"],
        },
    });
    return followers.map((follower) => {
        var _a, _b;
        return ({
            id: follower.id,
            name: (_a = follower.follower) === null || _a === void 0 ? void 0 : _a.name,
            email: (_b = follower.follower) === null || _b === void 0 ? void 0 : _b.email,
        });
    });
});
exports.getFollowers = getFollowers;
const getFollowing = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const following = yield friendsModel_1.default.findAll({
        where: {
            user_id: userId,
            status: "A",
        },
        include: {
            model: usersModel_1.default,
            as: "following",
            attributes: ["id", "name", "email"],
        },
    });
    return following.map((followedUser) => {
        var _a, _b;
        return ({
            id: followedUser.id,
            name: (_a = followedUser.following) === null || _a === void 0 ? void 0 : _a.name,
            email: (_b = followedUser.following) === null || _b === void 0 ? void 0 : _b.email,
        });
    });
});
exports.getFollowing = getFollowing;
const deleteFollower = (userId, email) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user by email
    const follower = yield usersModel_1.default.findOne({ where: { email } });
    if (!follower) {
        throw new Error("User with the provided email not found.");
    }
    // Check if the connection exists where the user is the friend_id (follower)
    const connection = yield friendsModel_1.default.findOne({
        where: {
            status: "A",
            user_id: follower.id, // Follower's user ID
            friend_id: userId, // Current user's ID
        },
    });
    if (!connection) {
        throw new Error("Follower connection not found.");
    }
    // Mark the connection as deleted
    connection.status = "D";
    yield connection.save();
    return { message: "Follower connection deleted successfully." };
});
exports.deleteFollower = deleteFollower;
const deleteFollowing = (userId, email) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user by email
    const following = yield usersModel_1.default.findOne({ where: { email } });
    if (!following) {
        throw new Error("User with the provided email not found.");
    }
    // Check if the connection exists where the user is the user_id (following)
    const connection = yield friendsModel_1.default.findOne({
        where: {
            status: "A",
            user_id: userId, // Current user's ID
            friend_id: following.id, // Following's user ID
        },
    });
    if (!connection) {
        throw new Error("Following connection not found.");
    }
    // Mark the connection as deleted
    connection.status = "D";
    yield connection.save();
    return { message: "Following connection deleted successfully." };
});
exports.deleteFollowing = deleteFollowing;
const getFollowersOfFriend = (userId, email) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user by email
    const friend = yield usersModel_1.default.findOne({ where: { email } });
    if (!friend) {
        throw new Error("User with the provided email not found.");
    }
    // Check if the logged-in user is following the friend
    const isFollowing = yield friendsModel_1.default.findOne({
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
    const followers = yield friendsModel_1.default.findAll({
        where: {
            friend_id: friend.id,
            status: "A", // Only active followers
        },
        include: [
            {
                model: usersModel_1.default,
                as: "follower",
                attributes: ["id", "name", "email"],
            },
        ],
    });
    return followers.map((follower) => {
        var _a, _b;
        return ({
            id: follower.user_id,
            name: (_a = follower.follower) === null || _a === void 0 ? void 0 : _a.name,
            email: (_b = follower.follower) === null || _b === void 0 ? void 0 : _b.email,
        });
    });
});
exports.getFollowersOfFriend = getFollowersOfFriend;
const getFollowingOfFriend = (userId, email) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user by email
    const friend = yield usersModel_1.default.findOne({ where: { email } });
    if (!friend) {
        throw new Error("User with the provided email not found.");
    }
    // Check if the logged-in user is following the friend
    const isFollowing = yield friendsModel_1.default.findOne({
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
    const following = yield friendsModel_1.default.findAll({
        where: {
            user_id: friend.id, // friend is following someone
            status: "A", // Only active following relationships
        },
        include: [
            {
                model: usersModel_1.default,
                as: "following", // The friend being followed by the specified user
                attributes: ["id", "name", "email"],
            },
        ],
    });
    return following.map((follow) => {
        var _a, _b;
        return ({
            id: follow.friend_id,
            name: (_a = follow.following) === null || _a === void 0 ? void 0 : _a.name,
            email: (_b = follow.following) === null || _b === void 0 ? void 0 : _b.email,
        });
    });
});
exports.getFollowingOfFriend = getFollowingOfFriend;
