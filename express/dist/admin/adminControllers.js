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
const adminServices_1 = require("./adminServices");
const express_1 = require("express");
const validateMiddleware_1 = __importDefault(require("../middlewares/validateMiddleware"));
const loginDto_1 = __importDefault(require("./dtos/loginDto"));
const logger_1 = __importDefault(require("../helper/logger"));
const moviesModel_1 = __importDefault(require("../models/moviesModel"));
const updateUserDto_1 = __importDefault(require("./dtos/updateUserDto"));
const multer_1 = require("../multer"); // Import the multer instance
const imagesModel_1 = __importDefault(require("../models/imagesModel"));
// import SignupDto from './dtos/signupDto';
const router = (0, express_1.Router)();
router.post("/login", (0, validateMiddleware_1.default)(loginDto_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const result = yield (0, adminServices_1.login)(body);
        res.cookie('admin_token', result, {
            httpOnly: true, // Can't be accessed by JavaScript (prevents XSS attacks)
            secure: process.env.NODE_ENV === 'production', // Only send the cookie over HTTPS
            maxAge: 3600000, // 1 hour expiration time
        });
        res.send(result);
    }
    catch (err) {
        next(err);
    }
}));
// Get user list
router.get("/users", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.admin_token) === null || _a === void 0 ? void 0 : _a.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const result = yield (0, adminServices_1.getUsers)();
        res.status(200).json({ users: result });
    }
    catch (error) {
        next(error);
    }
}));
router.get("/users/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.admin_token) === null || _a === void 0 ? void 0 : _a.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const { id } = req.params;
        const result = yield (0, adminServices_1.getUser)(Number(id));
        res.status(200).json({ users: result });
    }
    catch (error) {
        next(error);
    }
}));
// Update user details
router.put("/users/:id", (0, validateMiddleware_1.default)(updateUserDto_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.admin_token) === null || _a === void 0 ? void 0 : _a.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const { id } = req.params;
        const body = req.body;
        const result = yield (0, adminServices_1.updateUser)(Number(id), body);
        res.status(200).json({ message: "User updated successfully.", user: result });
    }
    catch (error) {
        next(error);
    }
}));
// Delete a user
router.delete("/users/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.admin_token) === null || _a === void 0 ? void 0 : _a.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const { id } = req.params;
        const result = yield (0, adminServices_1.deleteUser)(Number(id));
        res.status(200).json({ message: "User deleted successfully." });
    }
    catch (error) {
        next(error);
    }
}));
router.get("/reviews", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.admin_token) === null || _a === void 0 ? void 0 : _a.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const reviews = yield (0, adminServices_1.getReviews)(); // Fetch all reviews
        res.status(200).json({ message: "Reviews fetched successfully.", reviews });
    }
    catch (error) {
        next(error);
    }
}));
// Get a single review by ID
router.get("/reviews/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.admin_token) === null || _a === void 0 ? void 0 : _a.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const { id } = req.params;
        const review = yield (0, adminServices_1.getReviewById)(Number(id)); // Fetch review by ID
        res.status(200).json({ message: "Review fetched successfully.", review });
    }
    catch (error) {
        next(error);
    }
}));
// Delete a review by ID
router.delete("/reviews/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies.admin_token) === null || _a === void 0 ? void 0 : _a.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const { id } = req.params;
        yield (0, adminServices_1.deleteReview)(Number(id)); // Delete the review by ID
        res.status(200).json({ message: "Review deleted successfully." });
    }
    catch (error) {
        next(error);
    }
}));
router.post("/movie", multer_1.upload.fields([{ name: "poster", maxCount: 1 }, { name: "images", maxCount: 10 }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_a = req.cookies.admin_token) === null || _a === void 0 ? void 0 : _a.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const data = req.body;
        // Type assertion for req.files
        const files = req.files;
        // Save the path of the uploaded poster (if any)
        if ((_b = files["poster"]) === null || _b === void 0 ? void 0 : _b[0]) {
            data.poster = files["poster"][0].path;
        }
        // Create the movie entry in the database
        const createdMovie = yield moviesModel_1.default.create(data);
        // Handle multiple images
        const images = files["images"] || []; // Initialize images from files["images"]
        console.log(images); // Log the array of images for debugging
        if (images.length > 0) {
            // Save image paths in the `images` table
            const imageRecords = yield Promise.all(images.map((file) => imagesModel_1.default.create({
                movie_id: createdMovie.id,
                image: file.path,
            })));
            console.log(`Added ${imageRecords.length} images for movie ID ${createdMovie.id}`);
        }
        res.status(200).json({
            message: "Movie created successfully.",
            movie: createdMovie,
            images: images.map((file) => file.path), // Return the paths of added images
        });
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
router.put("/movie/:id", multer_1.upload.fields([{ name: "poster", maxCount: 1 }, { name: "images", maxCount: 10 }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const movieId = parseInt(req.params.id); // Extract the movie ID from the URL parameter
        const data = req.body; // Get the data from the request body
        const token = (_a = req.cookies.admin_token) === null || _a === void 0 ? void 0 : _a.admin_token; // Get the admin token from cookies
        // Check if the admin token exists
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        // Check if the movie exists in the database
        const movie = yield moviesModel_1.default.findByPk(movieId);
        if (!movie) {
            res.status(404).json({ message: "Movie not found." });
            return;
        }
        // Type assertion for req.files
        const files = req.files;
        // Save the path of the uploaded poster (if any)
        if ((_b = files["poster"]) === null || _b === void 0 ? void 0 : _b[0]) {
            data.poster = files["poster"][0].path;
        }
        // Update the movie entry in the database
        yield moviesModel_1.default.update(data, { where: { id: movieId } });
        // Handle multiple images
        const images = files["images"] || []; // Initialize images from files["images"]
        console.log(images); // Log the array of images for debugging
        if (images.length > 0) {
            // Save new image paths in the `images` table
            const imageRecords = yield Promise.all(images.map((file) => imagesModel_1.default.create({
                movie_id: movieId, // Directly use movieId as a reference
                image: file.path,
            })));
            console.log(`Added ${imageRecords.length} images for movie ID ${movieId}`);
        }
        // Fetch the updated movie from the database
        const updatedMovie = yield moviesModel_1.default.findByPk(movieId);
        // Fetch the associated images manually using the movieId
        const associatedImages = yield imagesModel_1.default.findAll({
            where: { movie_id: movieId },
        });
        res.status(200).json({
            message: "Movie updated successfully.",
            movie: updatedMovie,
            images: associatedImages.map((image) => image.image), // Return the image paths
        });
    }
    catch (error) {
        console.error("Error updating movie:", error); // Log the error for debugging
        next(error);
    }
}));
router.delete("/movie/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const movieId = parseInt(req.params.id);
        const token = (_a = req.cookies.admin_token) === null || _a === void 0 ? void 0 : _a.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const result = yield (0, adminServices_1.deleteMovie)(movieId, token);
        res.status(200).json(result);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
// router.post("/signup",ValidateMiddleware(SignupDto) , async (req : Request , res : Response , next : NextFunction)=>{
//     try{
//         const body : SignupDto = req.body;
//         const result = await signup(body)
//         res.send(result)
//     }catch(err :any){
//         next(err)
//     }
// });
exports.default = router;
