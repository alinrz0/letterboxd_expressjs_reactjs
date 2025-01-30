"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromToken = void 0;
const index_1 = require("../utils/index");
const getUserFromToken = (token) => {
    if (!token) {
        throw new Error("Token not found or invalid.");
    }
    const user = (0, index_1.decodeToken)(token);
    if (!user || !user.id) {
        throw new Error("Invalid token payload.");
    }
    return user;
};
exports.getUserFromToken = getUserFromToken;
