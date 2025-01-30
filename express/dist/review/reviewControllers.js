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
const validateMiddleware_1 = __importDefault(require("../middlewares/validateMiddleware"));
const createReviewDto_1 = __importDefault(require("./dtos/createReviewDto"));
const reviewServices_1 = require("./reviewServices");
const logger_1 = __importDefault(require("../helper/logger"));
const router = (0, express_1.Router)();
router.post("/review", (0, validateMiddleware_1.default)(createReviewDto_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }
        const movie_id = parseInt(req.query.movie_id);
        if (isNaN(movie_id)) {
            res.status(400).json({ message: "Movie ID must be a valid number." });
            return;
        }
        const createReviewDto = Object.assign(Object.assign({}, req.body), { movie_id });
        // Check if the user has already reviewed the movie
        const existingReview = yield (0, reviewServices_1.checkExistingReview)(token, movie_id);
        if (existingReview) {
            res.status(400).json({
                message: "You have already submitted a review for this movie.",
            });
            return;
        }
        // Add the review
        const newReview = yield (0, reviewServices_1.addReview)(token, createReviewDto);
        res.status(201).json({
            message: "Review submitted successfully.",
            review: newReview,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
router.get("/review", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }
        const user = (0, reviewServices_1.getUserFromToken)(token); // Use the getUserFromToken service
        const { email } = req.query;
        if (!email) {
            res.status(400).json({ message: "Email query parameter is required." });
            return;
        }
        try {
            const { reviews, friendInfo } = yield (0, reviewServices_1.getReviewsByFriendEmailWithInfo)(user.id, email);
            res.status(200).json({
                message: "Reviews fetched successfully.",
                friend: friendInfo,
                reviews,
            });
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
