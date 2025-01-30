"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Initialize Sequelize with MySQL connection
const sequelize = new sequelize_1.Sequelize('imdb', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
});
exports.default = sequelize;
