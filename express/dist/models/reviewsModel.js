"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class Review extends sequelize_1.Model {
}
const ReviewModel = db_1.default.define("review", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    movie_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    review: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 5,
        },
    },
});
exports.default = ReviewModel;
