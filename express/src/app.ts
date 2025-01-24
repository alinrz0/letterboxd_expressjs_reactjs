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

import ErrorHandelingMid  from './middlewares/ErrorHandelingMid';

const app = express();
const port = 3000;

app.use(cookieParser());

app.use(cors());
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
app.use("/" ,friendController);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(ErrorHandelingMid)

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});




