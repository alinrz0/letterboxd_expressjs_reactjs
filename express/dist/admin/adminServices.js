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
exports.deleteMovie = exports.updateMovie = exports.deleteReview = exports.getReviewById = exports.getReviews = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.login = void 0;
const index_1 = require("./../utils/index");
const adminModel_1 = __importDefault(require("../models/adminModel"));
const reviewsModel_1 = __importDefault(require("../models/reviewsModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const serverError_1 = __importDefault(require("../errors/serverError"));
const usersModel_1 = __importDefault(require("../models/usersModel"));
const utils_1 = require("../utils");
const moviesModel_1 = __importDefault(require("../models/moviesModel"));
const login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield adminModel_1.default.findOne({ where: { username: data.username } });
    if (!user)
        throw new serverError_1.default(404, "User not found");
    const compare = yield bcrypt_1.default.compare(data.password, user.password);
    if (!compare)
        throw new serverError_1.default(400, "Invalid credentials");
    const token = (0, index_1.encodeToken)({ id: user.id });
    return { admin_token: `${token}` };
});
exports.login = login;
// Get user list
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield usersModel_1.default.findAll({
        attributes: ["id", "name", "email", "createdAt", "updatedAt"], // Include only necessary fields
    });
    return users;
});
exports.getUsers = getUsers;
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersModel_1.default.findByPk(id);
    if (!user) {
        throw new serverError_1.default(404, "User not found.");
    }
    return user;
});
exports.getUser = getUser;
// Update user details
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersModel_1.default.findByPk(id);
    if (!user) {
        throw new serverError_1.default(404, "User not found.");
    }
    // Update the user's details
    yield user.update(data);
    return user;
});
exports.updateUser = updateUser;
// Delete a user
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersModel_1.default.findByPk(id);
    if (!user) {
        throw new serverError_1.default(404, "User not found.");
    }
    // Delete the user (can also use soft delete if needed)
    yield user.destroy();
    return { id };
});
exports.deleteUser = deleteUser;
// Get all reviews
const getReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield reviewsModel_1.default.findAll(); // Fetch all reviews from the database
        return reviews;
    }
    catch (error) {
        throw new serverError_1.default(500, "Error fetching reviews.");
    }
});
exports.getReviews = getReviews;
// Get a single review by ID
const getReviewById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield reviewsModel_1.default.findByPk(id); // Fetch review by primary key (ID)
        if (!review) {
            throw new serverError_1.default(404, "Review not found.");
        }
        return review;
    }
    catch (error) {
        throw new serverError_1.default(500, "Error fetching the review.");
    }
});
exports.getReviewById = getReviewById;
// Delete a review by ID
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield reviewsModel_1.default.findByPk(id); // Find the review by ID
        if (!review) {
            throw new serverError_1.default(404, "Review not found.");
        }
        yield review.destroy(); // Delete the review from the database
    }
    catch (error) {
        throw new serverError_1.default(500, "Error deleting the review.");
    }
});
exports.deleteReview = deleteReview;
const updateMovie = (movieId, data, token) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield moviesModel_1.default.findOne({ where: { id: movieId } });
    if (!movie) {
        throw new Error("Movie not found or you do not have permission to update it");
    }
    return yield movie.update(data);
});
exports.updateMovie = updateMovie;
const deleteMovie = (movieId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, utils_1.decodeToken)(token);
    // Find the movie to ensure it exists and belongs to the user
    const movie = yield moviesModel_1.default.findOne({ where: { id: movieId } });
    if (!movie) {
        throw new Error("Movie not found or you do not have permission to delete it");
    }
    yield movie.destroy();
    return { message: "Movie deleted successfully" };
});
exports.deleteMovie = deleteMovie;
// export const signup = async (data: SignupDto) => {
//     const hashedPassword = await bcrypt.hash(data.password, 10);
//     const newUser = await AdminModel.create({...data , password : hashedPassword})
//     const token = encodeToken({id : newUser.id})
//     return {token : `${token}`}
//   };
