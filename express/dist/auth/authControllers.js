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
const authServices_1 = require("./authServices");
const express_1 = require("express");
const signupDto_1 = __importDefault(require("./dtos/signupDto"));
const validateMiddleware_1 = __importDefault(require("../middlewares/validateMiddleware"));
const loginDto_1 = __importDefault(require("./dtos/loginDto"));
const router = (0, express_1.Router)();
router.post("/login", (0, validateMiddleware_1.default)(loginDto_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const result = yield (0, authServices_1.login)(body);
        res.cookie('token', result, {
            httpOnly: true, // Can't be accessed by JavaScript (prevents XSS attacks)
            secure: process.env.NODE_ENV === 'production', // Only send the cookie over HTTPS
            maxAge: 3600000, // 1 hour expiration time
        });
        res.send(result);
    }
    catch (err) {
        next(err);
    }
}));
router.post("/signup", (0, validateMiddleware_1.default)(signupDto_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const result = yield (0, authServices_1.signup)(body);
        res.send(result);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
