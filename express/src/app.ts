import express, { Request, Response } from 'express';
import cors from 'cors';
import logger from './helper/logger';
import sequelize from './db'; 
import cookieParser from 'cookie-parser';
import path from "path";

// import {authControllers} from './auth';
// import {movieControllers} from './movie';
// import {homeControllers} from './home';

import ErrorHandelingMid  from './middlewares/ErrorHandelingMid';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"home","views"));
app.use(express.static(path.join(__dirname, "home",'public')));

app.use(cookieParser());

app.use(cors());
app.use(express.json());

// Function to authenticate and sync the database
const initializeDatabase = async () => {
  try {
    // Authenticate the connection once
    await sequelize.authenticate();
    logger.info('Connection to the database has been established successfully.');

    // Sync the models (create tables if they don't exist)
    await sequelize.sync();
    logger.info('Database tables are synchronized.');
  } catch (error) {
    logger.error('Unable to connect to the database or sync:', error);
  }
};

initializeDatabase();

// app.use("/auth" ,authControllers);
// app.use("/movie" ,movieControllers);
// app.use("/" ,homeControllers);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(ErrorHandelingMid)

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});




