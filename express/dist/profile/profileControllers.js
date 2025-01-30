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
const profileServices_1 = require("./profileServices");
const logger_1 = __importDefault(require("../helper/logger"));
const usersModel_1 = __importDefault(require("../models/usersModel"));
const reviewsModel_1 = __importDefault(require("../models/reviewsModel"));
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.token) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Token not found or invalid" });
            return;
        }
        const user = (0, profileServices_1.getUserFromToken)(token);
        try {
            // Find the user in the database
            const userProfile = yield usersModel_1.default.findOne({
                where: { id: user.id },
                attributes: ["id", "name", "email", "createdAt"], // Customize the fields as needed
            });
            if (!userProfile) {
                res.status(404).json({ message: "User profile not found." });
                return;
            }
            // Fetch all reviews by the user
            const userReviews = yield reviewsModel_1.default.findAll({
                where: { user_id: user.id },
                attributes: ["movie_id", "review", "rating", "createdAt"],
            });
            res.status(200).json({
                message: "Profile and reviews fetched successfully.",
                profile: userProfile,
                reviews: userReviews,
            });
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching profile or reviews." });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
exports.default = router;
