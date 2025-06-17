import axios from 'axios';
import { TMDB_API_KEY, JIKAN_API_URL } from '../config/index.js';

export const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: TMDB_API_KEY, language: 'en-US' },
});

export const jikanClient = axios.create({
  baseURL: JIKAN_API_URL,
});