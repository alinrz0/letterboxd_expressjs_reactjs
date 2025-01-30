"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const usersModel_1 = __importDefault(require("../models/usersModel"));
class Friend extends sequelize_1.Model {
}
const FriendModel = db_1.default.define("friend", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    friend_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("W", "A", "R", "D"),
        allowNull: false,
        defaultValue: "W",
    },
});
FriendModel.belongsTo(usersModel_1.default, { as: "follower", foreignKey: "user_id" });
FriendModel.belongsTo(usersModel_1.default, { as: "following", foreignKey: "friend_id" });
exports.default = FriendModel;
