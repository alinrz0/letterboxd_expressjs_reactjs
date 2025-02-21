import {login ,deleteUser ,updateUser,getUsers,getUser ,getReviews,getReviewById,deleteReview ,updateMovie,deleteMovie} from './adminServices';
import { Router , Request , Response , NextFunction } from "express";
import ValidateMiddleware  from '../middlewares/validateMiddleware';
import LoginDto from './dtos/loginDto';
import logger from "../helper/logger";
import movieModel from '../models/moviesModel'; 
import UpdateUserDto from "./dtos/updateUserDto";
import CreateMovieDto  from "../movie/dtos/movieCreateDto";
import { upload } from '../multer'; // Import the multer instance
import ImagesModel from '../models/imagesModel';
// import SignupDto from './dtos/signupDto';

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.admin_token?.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        res.status(200).json({ admin_token: token });
    } catch (error) {
        next(error);
    }
});

router.post("/login" , ValidateMiddleware(LoginDto) ,  async (req : Request , res : Response , next : NextFunction)=>{
    try{
        const body : LoginDto = req.body;
        const result = await login(body)
        res.cookie('admin_token', result, {
            httpOnly: true,    // Can't be accessed by JavaScript (prevents XSS attacks)
            secure: process.env.NODE_ENV === 'production', // Only send the cookie over HTTPS
            maxAge: 3600000,   // 1 hour expiration time
        });
        res.send(result)   
    }catch(err :any){
        next(err)
    }
});

// Get user list
router.get("/users", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.admin_token?.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }

        const result = await getUsers();
        res.status(200).json({ users: result });
    } catch (error) {
        next(error);
    }
});

router.get("/users/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.admin_token?.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const { id } = req.params;
        const result = await getUser(Number(id));
        res.status(200).json({ users: result });
    } catch (error) {
        next(error);
    }
});

// Update user details
router.put(
    "/users/:id",
    ValidateMiddleware(UpdateUserDto),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.admin_token?.admin_token;
            if (!token) {
                res.status(401).json({ message: "Unauthorized." });
                return;
            }
            const { id } = req.params;
            const body: UpdateUserDto = req.body;

            const result = await updateUser(Number(id), body);
            res.status(200).json({ message: "User updated successfully.", user: result });
        } catch (error) {
            next(error);
        }
    }
);

// Delete a user
router.delete("/users/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.admin_token?.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        
        const { id } = req.params;

        const result = await deleteUser(Number(id));
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        next(error);
    }
});


router.get("/reviews", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.admin_token?.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const reviews = await getReviews(); // Fetch all reviews
        res.status(200).json({ message: "Reviews fetched successfully.", reviews });
    } catch (error) {
        next(error);
    }
});

// Get a single review by ID
router.get("/reviews/:id",  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.admin_token?.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const { id } = req.params;
        const review = await getReviewById(Number(id)); // Fetch review by ID
        res.status(200).json({ message: "Review fetched successfully.", review });
    } catch (error) {
        next(error);
    }
});

// Delete a review by ID
router.delete("/reviews/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.admin_token?.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const { id } = req.params;
        await deleteReview(Number(id)); // Delete the review by ID
        res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
        next(error);
    }
});

router.post(
    "/movie",
    upload.fields([{ name: "poster", maxCount: 1 }, { name: "images", maxCount: 10 }]),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.cookies.admin_token?.admin_token;
            if (!token) {
                res.status(401).json({ message: "Unauthorized." });
                return;
            }

            const data: CreateMovieDto = req.body;

            // Type assertion for req.files
            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };

            // Save the path of the uploaded poster (if any)
            if (files["poster"]?.[0]) {
                data.poster = files["poster"][0].path;
            }

            // Create the movie entry in the database
            const createdMovie = await movieModel.create(data);

            // Handle multiple images
            const images = files["images"] || []; // Initialize images from files["images"]
            console.log(images); // Log the array of images for debugging

            if (images.length > 0) {
                // Save image paths in the `images` table
                const imageRecords = await Promise.all(
                    images.map((file) =>
                        ImagesModel.create({
                            movie_id: createdMovie.id,
                            image: file.path,
                        })
                    )
                );

                console.log(`Added ${imageRecords.length} images for movie ID ${createdMovie.id}`);
            }

            res.status(200).json({
                message: "Movie created successfully.",
                movie: createdMovie,
                images: images.map((file) => file.path), // Return the paths of added images
            });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
);





router.put(
    "/movie/:id",
    upload.single("poster"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const movieId = parseInt(req.params.id);
            const data: Partial<CreateMovieDto> = req.body;
            const token = req.cookies.admin_token?.admin_token;

            if (!token) {
                res.status(401).json({ message: "Unauthorized." });
                return;
            }

            const movie = await movieModel.findByPk(movieId);
            if (!movie) {
                res.status(404).json({ message: "Movie not found." });
                return;
            }

            if (req.file) {
                data.poster = req.file.path; // Update poster if uploaded
            }

            await movieModel.update(data, { where: { id: movieId } });

            // Fetch updated movie details
            const updatedMovie = await movieModel.findByPk(movieId);

            res.status(200).json({
                message: "Movie updated successfully.",
                movie: updatedMovie,
            });
        } catch (error) {
            console.error("Error updating movie:", error);
            next(error);
        }
    }
);

// Upload new images
router.post(
    "/movie/:id/images",
    upload.array("images", 10),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const movieId = parseInt(req.params.id);
            const token = req.cookies.admin_token?.admin_token;

            if (!token) {
                res.status(401).json({ message: "Unauthorized." });
                return;
            }

            if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
                res.status(400).json({ message: "No images uploaded." });
                return;
            }

            const images = req.files as Express.Multer.File[];
            const imageRecords = await Promise.all(
                images.map((file) =>
                    ImagesModel.create({
                        movie_id: movieId,
                        image: file.path,
                    })
                )
            );

            res.status(201).json({
                message: "Images uploaded successfully.",
                images: imageRecords.map((image) => image.image),
            });
        } catch (error) {
            console.error("Error uploading images:", error);
            next(error);
        }
    }
);

// Delete an image
router.delete(
    "/movie/:id/images",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const movieId = parseInt(req.params.id);
            const imageName = req.query.name as string;
            const token = req.cookies.admin_token?.admin_token;

            if (!token) {
                res.status(401).json({ message: "Unauthorized." });
                return;
            }

            if (!imageName) {
                res.status(400).json({ message: "Image name is required." });
                return;
            }
            const imageRecord = await ImagesModel.findOne({
                where: { movie_id: movieId, image: imageName },
            });

            if (!imageRecord) {
                res.status(404).json({ message: "Image not found." });
                return;
            }

            await ImagesModel.destroy({ where: { movie_id: movieId, image: imageName } });

            res.status(200).json({ message: "Image deleted successfully." });
        } catch (error) {
            console.error("Error deleting image:", error);
            next(error);
        }
    }
);

  

router.delete("/movie/:id" , async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const movieId = parseInt(req.params.id);
        const token = req.cookies.admin_token?.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }

        const result = await deleteMovie(movieId, token);
        res.status(200).json(result);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

// router.post("/signup",ValidateMiddleware(SignupDto) , async (req : Request , res : Response , next : NextFunction)=>{
//     try{
//         const body : SignupDto = req.body;
//         const result = await signup(body)
//         res.send(result)
//     }catch(err :any){
//         next(err)
//     }
// });

export default router;