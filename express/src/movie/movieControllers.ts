import { Router, Request, Response, NextFunction } from "express";
import movieModel from '../models/moviesModel'; 
import genresModel from '../models/genresModel'; 
import ImagesModel from '../models/imagesModel'; 
import logger from "../helper/logger";
import { Op ,Sequelize} from "sequelize";
import path from 'path';
import fs from 'fs';

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

router.get("/genres", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const movies = await genresModel.findAll();
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get(
    "/:id",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const movieId = parseInt(req.params.id);

            // Fetch the movie details
            const movie = await movieModel.findOne({ where: { id: movieId } });

            if (!movie) {
                res.status(404).json({ message: "Movie not found" });
                return;
            }

            // Fetch associated images for the movie
            const images = await ImagesModel.findAll({
                where: { movie_id: movieId },
            });

            res.status(200).json({
                movie,
                images: images.map((image) => image.image), // Return only the image paths
            });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
);


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


const imagesDirectory = path.join(__dirname, '../images');

router.get("/movie/image", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const imageName = req.query.name as string; // Get the image name from query parameter

        // Check if the name is provided
        if (!imageName) {
            res.status(400).json({ message: "Image name is required." });
            return;
        }

        // Construct the full path to the image file
        const imagePath = path.join(imagesDirectory, imageName);

        // Check if the file exists
        if (!fs.existsSync(imagePath)) {
            res.status(404).json({ message: "Image not found." });
            return;
        }

        // Serve the image file
        res.sendFile(imagePath);
    } catch (error) {
        console.error('Error fetching image:', error);
        next(error);
    }
});

export default router;
