import {login ,deleteUser ,updateUser,getUsers,getUser ,getReviews,getReviewById,deleteReview ,updateMovie,deleteMovie} from './adminServices';
import { Router , Request , Response , NextFunction } from "express";
import ValidateMiddleware  from '../middlewares/validateMiddleware';
import LoginDto from './dtos/loginDto';
import logger from "../helper/logger";
import movieModel from '../models/moviesModel'; 
import UpdateUserDto from "./dtos/updateUserDto";
import CreateMovieDto  from "../movie/dtos/movieCreateDto";
// import SignupDto from './dtos/signupDto';

const router = Router();

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


router.post("/movie", ValidateMiddleware(CreateMovieDto) ,  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.admin_token?.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }

        const data: CreateMovieDto = req.body;

        const result = await movieModel.create({
            title: data.title,
            description: data.description,
            year: data.year,
            genre: data.genre,
            rate: data.rate,
        });
        

        console.log(3)
        res.status(200).json(result);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

router.put("/movie/:id" ,  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const movieId = parseInt(req.params.id);
        const data: Partial<CreateMovieDto> = req.body;
        const token = req.cookies.admin_token?.admin_token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }

        // Update the movie with the provided data
        const result = await updateMovie(movieId, data, token);
        res.status(200).json(result);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

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