"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
exports.default = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(info => `${info.timestamp} ${info.level} : ${info.message}`)),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(info => `${info.timestamp} ${info.level} : ${info.message}`))
        }),
        new winston_1.default.transports.File({ filename: "./logs/error.log", level: "error", maxsize: 5242880, maxFiles: 4 }),
        new winston_1.default.transports.File({ filename: "./logs/info.log", level: "info", maxsize: 5242880, maxFiles: 4 }),
        new winston_1.default.transports.File({ filename: "./logs/warn.log", level: "warn", maxsize: 5242880, maxFiles: 4 }),
    ]
});
