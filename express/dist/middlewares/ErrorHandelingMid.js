"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverError_1 = __importDefault(require("../errors/serverError"));
const logger_1 = __importDefault(require("../helper/logger"));
const ErrorHandelingMIdderware = (error, req, res, next) => {
    if (error instanceof serverError_1.default) {
        res.status(error.status).send({
            status: error.status,
            message: error.message
        });
    }
    else {
        logger_1.default.error(error);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};
exports.default = ErrorHandelingMIdderware;
