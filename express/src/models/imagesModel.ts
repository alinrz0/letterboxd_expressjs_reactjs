import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import MoviesModel  from "./moviesModel";

interface ImageAttributes {
  id: number;
  movie_id: number;
  image: string;
}

interface ImageCreationAttributes extends Optional<ImageAttributes, 'id'> {}

class Image extends Model<ImageAttributes, ImageCreationAttributes> implements ImageAttributes {
  public id!: number;
  public movie_id!: number;
  public image!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
    private _id: any;
}

const ImagesModel = sequelize.define<Image, ImageCreationAttributes>('image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  movie_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// ImagesModel.belongsTo(MoviesModel, { foreignKey: "movie_id" });

export default ImagesModel;
