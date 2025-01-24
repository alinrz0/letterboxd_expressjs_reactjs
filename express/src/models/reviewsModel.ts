import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface ReviewAttributes {
    id: number;
    user_id: number;
    movie_id: number;
    review: string;
    rating: number;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, "id"> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    public id!: number;
    public user_id!: number;
    public movie_id!: number;
    public review!: string;
    public rating!: number;
}

const ReviewModel = sequelize.define<Review>("review", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 5,
        },
    },
});

export default ReviewModel;
