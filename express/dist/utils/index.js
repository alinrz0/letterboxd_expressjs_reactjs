"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.encodeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRECT = "THIAISMYSECRET";
const encodeToken = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, SECRECT, { expiresIn: "1h" });
    return token;
};
exports.encodeToken = encodeToken;
const decodeToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, SECRECT); // Cast the result to DecodedToken
    return decoded;
};
exports.decodeToken = decodeToken;
