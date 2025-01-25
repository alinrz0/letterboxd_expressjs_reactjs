import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import UserModel from "../models/usersModel";

interface FriendAttributes {
    id: number;
    user_id: number;
    friend_id: number;
    status: "W" | "A" | "R" |"D"; 
}

interface FriendCreationAttributes extends Optional<FriendAttributes, "id"> {}

class Friend extends Model<FriendAttributes, FriendCreationAttributes> implements FriendAttributes {
    [x: string]: any;
    public id!: number;
    public user_id!: number;
    public friend_id!: number;
    public status!: "W" | "A" | "R"|"D";
    sender: any;
    follower: any;
    following: any;
}

const FriendModel = sequelize.define<Friend>("friend", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    friend_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("W", "A", "R", "D"),
        allowNull: false,
        defaultValue: "W",
    },
});

FriendModel.belongsTo(UserModel, { as: "follower", foreignKey: "user_id" });
FriendModel.belongsTo(UserModel, { as: "following", foreignKey: "friend_id" });

export default FriendModel;
