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
const express_1 = require("express");
const friendServices_1 = require("./friendServices");
const index_1 = require("../utils/index");
const logger_1 = __importDefault(require("../helper/logger"));
const router = (0, express_1.Router)();
router.post("/add-friend", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }
        const user = (0, index_1.decodeToken)(token); // Decode user info from the token
        const { friend_email } = req.body;
        if (!friend_email) {
            res.status(400).json({ message: "Friend email is required." });
            return;
        }
        const friend = yield (0, friendServices_1.findFriendByEmail)(friend_email);
        if (friend.id === user.id) {
            res.status(400).json({ message: "You cannot send a friend request to yourself." });
            return;
        }
        const existingRequest = yield (0, friendServices_1.findExistingRequest)(user.id, friend.id);
        if (existingRequest) {
            if (existingRequest.status === "A") {
                res.status(400).json({ message: "The user is already your friend." });
            }
            else if (existingRequest.status === "W") {
                res.status(400).json({ message: "Friend request is already pending." });
            }
            return;
        }
        const newFriendRequest = yield (0, friendServices_1.createFriendRequest)(user.id, friend.id);
        res.status(201).json({ message: "Friend request sent.", request: newFriendRequest });
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
router.get("/friend-requests", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }
        const user = (0, index_1.decodeToken)(token);
        const requests = yield (0, friendServices_1.getPendingFriendRequests)(user.id);
        res.status(200).json({ message: "Friend requests fetched successfully.", requests });
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
router.put("/accept-friend", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }
        const user = (0, index_1.decodeToken)(token);
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required." });
            return;
        }
        const friend = yield (0, friendServices_1.findFriendByEmail)(email);
        const friendRequest = yield (0, friendServices_1.acceptFriendRequest)(friend.id, user.id);
        res.status(200).json({ message: "Friend request accepted.", friendRequest });
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
router.put("/reject-friend", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }
        const user = (0, index_1.decodeToken)(token);
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required." });
            return;
        }
        const friend = yield (0, friendServices_1.findFriendByEmail)(email);
        const friendRequest = yield (0, friendServices_1.rejectFriendRequest)(friend.id, user.id);
        res.status(200).json({ message: "Friend request rejected.", friendRequest });
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
router.get("/followers", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }
        const user = (0, friendServices_1.getUserFromToken)(token);
        const followers = yield (0, friendServices_1.getFollowers)(user.id);
        res.status(200).json({
            message: "Followers fetched successfully.",
            followers,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
// Get Following
router.get("/following", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }
        const user = (0, friendServices_1.getUserFromToken)(token);
        const following = yield (0, friendServices_1.getFollowing)(user.id);
        res.status(200).json({
            message: "Following fetched successfully.",
            following,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
// Delete a Follower
router.get("/delete-connection/follower", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }
        const user = (0, friendServices_1.getUserFromToken)(token);
        const { email } = req.query;
        if (!email) {
            res.status(400).json({ message: "Email query parameter is required." });
            return;
        }
        const result = yield (0, friendServices_1.deleteFollower)(user.id, email);
        res.status(200).json(result);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
// Delete a Following
router.get("/delete-connection/following", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }
        const user = (0, friendServices_1.getUserFromToken)(token);
        const { email } = req.query;
        if (!email) {
            res.status(400).json({ message: "Email query parameter is required." });
            return;
        }
        const result = yield (0, friendServices_1.deleteFollowing)(user.id, email);
        res.status(200).json(result);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
router.get("/followers-of", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }
        const user = (0, friendServices_1.getUserFromToken)(token);
        const { email } = req.query;
        if (!email) {
            res.status(400).json({ message: "Email query parameter is required." });
            return;
        }
        try {
            const followers = yield (0, friendServices_1.getFollowersOfFriend)(user.id, email);
            res.status(200).json({ message: "Followers fetched successfully.", followers });
        }
        catch (error) {
            res.status(403).json({ message: error });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
router.get("/following-of", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid." });
            return;
        }
        const user = (0, friendServices_1.getUserFromToken)(token); // Decode user from token
        const { email } = req.query;
        if (!email) {
            res.status(400).json({ message: "Email query parameter is required." });
            return;
        }
        try {
            const following = yield (0, friendServices_1.getFollowingOfFriend)(user.id, email);
            res.status(200).json({ message: "Following list fetched successfully.", following });
        }
        catch (error) {
            res.status(403).json({ message: error });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
exports.default = router;
