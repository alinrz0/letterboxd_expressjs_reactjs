import express, { Request, Response } from 'express';
import cors from 'cors';
import logger from './helper/logger';
import sequelize from './db'; 
import cookieParser from 'cookie-parser';
import path from "path";

import {authControllers} from './auth';
import {movieControllers} from './movie';
import {reviewControllers} from './review';
import {friendController} from './friend';
import {profileController} from './profile';
import {adminControllers} from './admin';

import ErrorHandelingMid  from './middlewares/ErrorHandelingMid';
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:5173", // Your React frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
app.use(express.json());

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connection to the database has been established successfully.');

    await sequelize.sync();
    logger.info('Database tables are synchronized.');
  } catch (error) {
    logger.error('Unable to connect to the database or sync:', error);
  }
};

initializeDatabase();

app.use("/" ,authControllers);
app.use("/movies" ,movieControllers);
app.use("/" ,reviewControllers);
app.use("/friend" ,friendController);
app.use("/profile" ,profileController);
app.use("/admin" ,adminControllers);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(ErrorHandelingMid)

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});




