import dotenv from 'dotenv';
dotenv.config();

export const TMDB_API_KEY = process.env.TMDB_API_KEY;
export const JIKAN_API_URL = process.env.JIKAN_API_URL;
export const JWT_SECRET = process.env.JWT_SECRET;