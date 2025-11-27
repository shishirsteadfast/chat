// src/config/db.ts
import { Sequelize } from 'sequelize';
import { env } from './env';

export const sequelize = new Sequelize(
  env.db.name,
  env.db.user,
  env.db.pass,
  {
    host: env.db.host,
    dialect: 'mysql',
    logging: false,
  }
);
