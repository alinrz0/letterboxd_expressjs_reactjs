import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface FriendAttributes {
    id: number;
    user_id: number;
    friend_id: number;
    status: "W" | "A" | "R"; 
}

interface FriendCreationAttributes extends Optional<FriendAttributes, "id"> {}

class Friend extends Model<FriendAttributes, FriendCreationAttributes> implements FriendAttributes {
    public id!: number;
    public user_id!: number;
    public friend_id!: number;
    public status!: "W" | "A" | "R";
    sender: any;
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
        type: DataTypes.ENUM("W", "A", "R"),
        allowNull: false,
        defaultValue: "W",
    },
});

export default FriendModel;
