import { Sequelize } from 'sequelize-typescript';
import { config } from './env';
import { logger } from '../utils/logger';

export const sequelize = new Sequelize({
  dialect: config.DB_DIALECT,
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  models: [__dirname + '/../models'],
  logging: config.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully');
    
    // Always sync in development and test environments
    if (config.NODE_ENV === 'development' || config.NODE_ENV === 'test') {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database synchronized');
    }
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger.info('✅ Database connection closed');
  } catch (error) {
    logger.error('❌ Error closing database connection:', error);
    throw error;
  }
};
