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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./helper/logger"));
const db_1 = __importDefault(require("./db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("./auth");
const movie_1 = require("./movie");
const review_1 = require("./review");
const friend_1 = require("./friend");
const profile_1 = require("./profile");
const admin_1 = require("./admin");
const ErrorHandelingMid_1 = __importDefault(require("./middlewares/ErrorHandelingMid"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.authenticate();
        logger_1.default.info('Connection to the database has been established successfully.');
        yield db_1.default.sync();
        logger_1.default.info('Database tables are synchronized.');
    }
    catch (error) {
        logger_1.default.error('Unable to connect to the database or sync:', error);
    }
});
initializeDatabase();
app.use("/", auth_1.authControllers);
app.use("/movies", movie_1.movieControllers);
app.use("/", review_1.reviewControllers);
app.use("/friend", friend_1.friendController);
app.use("/profile", profile_1.profileController);
app.use("/admin", admin_1.adminControllers);
app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'images')));
app.use(ErrorHandelingMid_1.default);
app.listen(port, () => {
    logger_1.default.info(`Server is running on http://localhost:${port}`);
});
