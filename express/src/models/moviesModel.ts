import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';  

interface MovieAttributes {
  id: number;
  title: string;
  description: string;
  image: string;
  user_id: number;
}

interface MovieCreationAttributes extends Optional<MovieAttributes, 'id'> {}

class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public image!: string;
  public user_id!: number;

}

const MoviesModel = sequelize.define<Movie, MovieCreationAttributes>('movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
});

export default MoviesModel;
