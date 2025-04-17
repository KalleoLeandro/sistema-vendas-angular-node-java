import dotenv from "dotenv";

dotenv.config();

export const environments = {
    PORT: process.env.PORT || 3000,
    BACK_END: process.env.BACK_END || 'http://localhost:8080',
    PUBLIC_KEY: process.env.PUBLIC_KEY
}