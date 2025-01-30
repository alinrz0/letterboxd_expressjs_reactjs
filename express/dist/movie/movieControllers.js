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
const moviesModel_1 = __importDefault(require("../models/moviesModel"));
const logger_1 = __importDefault(require("../helper/logger"));
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield moviesModel_1.default.findAll();
        res.status(200).json(movies);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = parseInt(req.params.id);
        const movie = yield moviesModel_1.default.findOne({ where: { id: movieId } });
        if (!movie) {
            res.status(404).json({ message: "Movie not found" });
            return;
        }
        res.status(200).json(movie);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
router.get("/filter/genre", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { genre } = req.query;
        // Validate that the genre is provided
        if (!genre || typeof genre !== "string") {
            res.status(400).json({ message: "Genre is required and must be a valid string." });
            return;
        }
        // Fetch movies matching the genre
        const movies = yield moviesModel_1.default.findAll({ where: { genre } });
        // Handle case where no movies are found
        if (!movies || movies.length === 0) {
            res.status(404).json({ message: `No movies found for the genre: ${genre}` });
            return;
        }
        // Respond with the found movies
        res.status(200).json(movies);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
router.get("/filter/year", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startYear, endYear } = req.query;
        // Validate that startYear and endYear are provided
        if (!startYear || !endYear) {
            res.status(400).json({ message: "Both startYear and endYear are required." });
            return;
        }
        const startYearInt = parseInt(startYear);
        const endYearInt = parseInt(endYear);
        if (isNaN(startYearInt) || isNaN(endYearInt)) {
            res.status(400).json({ message: "Both startYear and endYear must be valid numbers." });
            return;
        }
        // Query the movies by extracting the first 4 characters of the year column
        const movies = yield moviesModel_1.default.findAll({
            where: sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("SUBSTRING", sequelize_1.Sequelize.col("year"), 1, 4), {
                [sequelize_1.Op.between]: [startYearInt, endYearInt],
            }),
        });
        if (!movies || movies.length === 0) {
            res.status(404).json({ message: `No movies found between the years ${startYear} and ${endYear}.` });
            return;
        }
        res.status(200).json(movies);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
router.get("/filter/rate", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { minRate, maxRate } = req.query;
        if (!minRate || !maxRate) {
            res.status(400).json({ message: "Both minRate and maxRate are required." });
            return;
        }
        const movies = yield moviesModel_1.default.findAll({
            where: {
                rate: {
                    [sequelize_1.Op.between]: [parseFloat(minRate), parseFloat(maxRate)],
                },
            },
        });
        if (movies.length === 0) {
            res.status(404).json({ message: "No movies found in the given rate range." });
            return;
        }
        res.status(200).json(movies);
    }
    catch (error) {
        logger_1.default.error(error);
        next(error);
    }
}));
const imagesDirectory = path_1.default.join(__dirname, '../images');
router.get("/movie/image", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageName = req.query.name; // Get the image name from query parameter
        // Check if the name is provided
        if (!imageName) {
            res.status(400).json({ message: "Image name is required." });
            return;
        }
        // Construct the full path to the image file
        const imagePath = path_1.default.join(imagesDirectory, imageName);
        // Check if the file exists
        if (!fs_1.default.existsSync(imagePath)) {
            res.status(404).json({ message: "Image not found." });
            return;
        }
        // Serve the image file
        res.sendFile(imagePath);
    }
    catch (error) {
        console.error('Error fetching image:', error);
        next(error);
    }
}));
exports.default = router;
