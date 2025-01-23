import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface MovieAttributes {
  id: number;
  title: string;
  description: string;
  year: String;        
  genre: string;   
  rate: number;   
}

interface MovieCreationAttributes extends Optional<MovieAttributes, 'id'> {}

class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public year!: String;   
  public genre!: string; 
  public rate!: number; 
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
  year: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rate: {
    type: DataTypes.FLOAT, 
    allowNull: false,
  },
});

export default MoviesModel;
