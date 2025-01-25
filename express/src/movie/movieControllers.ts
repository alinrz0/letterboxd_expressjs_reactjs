import { Router, Request, Response, NextFunction } from "express";
import {updateMovie,deleteMovie } from "./movieServices";
import CreateMovieDto from "./dtos/movieCreateDto";
import movieModel from '../models/moviesModel'; 
import logger from "../helper/logger";
import { upload } from "../multer";
import { Op ,Sequelize} from "sequelize";

import ValidateMiddleware  from '../middlewares/validateMiddleware';

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const movies = await movieModel.findAll();
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const movieId = parseInt(req.params.id);
        const movie = await movieModel.findOne({ where: { id: movieId } });

        if (!movie) {
            res.status(404).json({ message: "Movie not found" });
            return;
        }

        res.status(200).json(movie);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});


router.get("/filter/genre", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { genre } = req.query;

        // Validate that the genre is provided
        if (!genre || typeof genre !== "string") {
            res.status(400).json({ message: "Genre is required and must be a valid string." });
            return;
        }

        // Fetch movies matching the genre
        const movies = await movieModel.findAll({ where: { genre } });

        // Handle case where no movies are found
        if (!movies || movies.length === 0) {
            res.status(404).json({ message: `No movies found for the genre: ${genre}` });
            return;
        }

        // Respond with the found movies
        res.status(200).json(movies);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

router.get("/filter/year", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { startYear, endYear } = req.query;

        // Validate that startYear and endYear are provided
        if (!startYear || !endYear) {
            res.status(400).json({ message: "Both startYear and endYear are required." });
            return;
        }

        const startYearInt = parseInt(startYear as string);
        const endYearInt = parseInt(endYear as string);

        if (isNaN(startYearInt) || isNaN(endYearInt)) {
            res.status(400).json({ message: "Both startYear and endYear must be valid numbers." });
            return;
        }

        // Query the movies by extracting the first 4 characters of the year column
        const movies = await movieModel.findAll({
            where: Sequelize.where(Sequelize.fn("SUBSTRING", Sequelize.col("year"), 1, 4), {
                [Op.between]: [startYearInt, endYearInt],
            }),
        });

        if (!movies || movies.length === 0) {
            res.status(404).json({ message: `No movies found between the years ${startYear} and ${endYear}.` });
            return;
        }

        res.status(200).json(movies);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});


router.get("/filter/rate", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { minRate, maxRate } = req.query;

        if (!minRate || !maxRate) {
            res.status(400).json({ message: "Both minRate and maxRate are required." });
            return;
        }

        const movies = await movieModel.findAll({
            where: {
                rate: {
                    [Op.between]: [parseFloat(minRate as string), parseFloat(maxRate as string)],
                },
            },
        });

        if (movies.length === 0) {
            res.status(404).json({ message: "No movies found in the given rate range." });
            return;
        }

        res.status(200).json(movies);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});


export default router;
