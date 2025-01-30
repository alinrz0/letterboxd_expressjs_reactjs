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
exports.getUserFromToken = exports.getReviewsByFriendEmailWithInfo = exports.addReview = exports.checkExistingReview = void 0;
const reviewsModel_1 = __importDefault(require("../models/reviewsModel"));
const moviesModel_1 = __importDefault(require("../models/moviesModel"));
const index_1 = require("../utils/index");
const usersModel_1 = __importDefault(require("../models/usersModel"));
const friendsModel_1 = __importDefault(require("../models/friendsModel"));
const sequelize_1 = require("sequelize");
const checkExistingReview = (token, movie_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, index_1.decodeToken)(token);
    if (!user || !user.id) {
        throw new Error("Invalid token payload.");
    }
    const existingReview = yield reviewsModel_1.default.findOne({
        where: { user_id: user.id, movie_id },
    });
    return existingReview;
});
exports.checkExistingReview = checkExistingReview;
const addReview = (token, createReviewDto) => __awaiter(void 0, void 0, void 0, function* () {
    // Decode user information from token
    const user = (0, index_1.decodeToken)(token);
    // Validate movie existence
    const movie = yield moviesModel_1.default.findByPk(createReviewDto.movie_id);
    if (!movie) {
        throw new Error("Movie not found.");
    }
    // Save the review
    const newReview = yield reviewsModel_1.default.create({
        user_id: user.id,
        movie_id: createReviewDto.movie_id,
        review: createReviewDto.review,
        rating: createReviewDto.rating,
    });
    return newReview;
});
exports.addReview = addReview;
// Fetch reviews if users are friends
const getReviewsByFriendEmailWithInfo = (user_id, friend_email) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the friend by email
    const friend = yield usersModel_1.default.findOne({ where: { email: friend_email } });
    if (!friend) {
        throw new Error("User with this email not found.");
    }
    // Check if they are friends
    const isFriend = yield friendsModel_1.default.findOne({
        where: {
            [sequelize_1.Op.or]: [
                { user_id, friend_id: friend.id, status: "A" },
                { user_id: friend.id, friend_id: user_id, status: "A" },
            ],
        },
    });
    if (!isFriend) {
        throw new Error("You are not friends with this user.");
    }
    // Retrieve all reviews of the friend
    const reviews = yield reviewsModel_1.default.findAll({
        where: { user_id: friend.id },
        attributes: ["movie_id", "review", "rating", "createdAt"],
    });
    // Return reviews along with the friend's name and email
    return {
        friendInfo: {
            name: friend.name,
            email: friend.email,
        },
        reviews,
    };
});
exports.getReviewsByFriendEmailWithInfo = getReviewsByFriendEmailWithInfo;
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
