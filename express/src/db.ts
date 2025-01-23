import { Sequelize } from 'sequelize';

// Initialize Sequelize with MySQL connection
const sequelize = new Sequelize('imdb', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
