import {login ,deleteUser ,updateUser,getUsers,getUser} from './adminServices';
import { Router , Request , Response , NextFunction } from "express";
import ValidateMiddleware  from '../middlewares/validateMiddleware';
import LoginDto from './dtos/loginDto';

import UpdateUserDto from "./dtos/updateUserDto";
import { NUMBER } from 'sequelize';
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