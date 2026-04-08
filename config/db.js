import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected sucessfully');
    await sequelize.sync({ alter: true }); // auto creates/updates tables
    console.log('All tables synced');
  } catch (error) {
    console.error('DB connection error:', error.message);
    process.exit(1);
  }
};

export default sequelize;