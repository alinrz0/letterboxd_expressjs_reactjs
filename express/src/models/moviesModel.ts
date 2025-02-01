import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface MovieAttributes {
  id: number;
  title: string;
  description: string;
  year: String;        
  genre: string;   
  rate: number; 
  poster:string;  
}

interface MovieCreationAttributes extends Optional<MovieAttributes, 'id'> {}

class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public year!: String;   
  public genre!: string; 
  public rate!: number; 
  public poster!: string; 
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
    allowNull: true,
  },
  poster: {
    type: DataTypes.STRING,
    allowNull: true,      
  },
});

export default MoviesModel;
