import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface GenreAttributes {
  id: number;
  name: string;
}

interface GenreCreationAttributes extends Optional<GenreAttributes, 'id'> {}

class Genre extends Model<GenreAttributes, GenreCreationAttributes> implements GenreAttributes {
  public id!: number;
  public name!: string; 
}

const GenresModel = sequelize.define<Genre, GenreCreationAttributes>('genre', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default GenresModel;
