import * as dotenv from 'dotenv';

dotenv.config();

export const environments = {
  PORT: process.env.PORT || 3000,
  BACK_END: process.env.BACK_END || 'http://localhost:8080',
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  NODE_ENV: process.env.NODE_ENV || 'localhost'
};