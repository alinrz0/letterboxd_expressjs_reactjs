import { signup, login } from "./authServices";
import { Router, Request, Response, NextFunction } from "express";
import SignupDto from "./dtos/signupDto";
import ValidateMiddleware from "../middlewares/validateMiddleware";
import LoginDto from "./dtos/loginDto";
import UserModel from "../models/usersModel"; // Sequelize model

const router = Router();

router.post(
  "/login",
  ValidateMiddleware(LoginDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: LoginDto = req.body;
      const result = await login(body);
      res.cookie("token", result, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });
      res.send(result);
    } catch (err: any) {
      next(err);
    }
  }
);

router.post(
  "/signup",
  ValidateMiddleware(SignupDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: SignupDto = req.body;
      const result = await signup(body);
      res.cookie("token", result, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });
      res.send(result);
    } catch (err: any) {
      next(err);
    }
  }
);

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out successfully" });
});


// Fetch user by email using Sequelize
router.get(
  "/users",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.query;
      if (!email || typeof email !== "string") {
        res.status(400).json({ message: "Email is required" });
        return;
      }

      const user = await UserModel.findOne({ where: { email } });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({ id: user.id, name: user.name, email: user.email });
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
