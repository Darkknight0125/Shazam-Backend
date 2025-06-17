import { tmdbClient, jikanClient } from '../utils/api.js';
import User from '../models/User.js';

export const getPopularMovies = async (req, res) => {
  try {
    const response = await tmdbClient.get('/movie/popular?page=1');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

export const getMovieDetails = async (req, res) => {
  const { movieId } = req.params;
  try {
    const response = await tmdbClient.get(`/movie/${movieId}`, {
      params: { append_to_response: 'credits,images,videos' },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
};

export const getPopularAnime = async (req, res) => {
  try {
    const response = await jikanClient.get('/top/anime');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch anime' });
  }
};

export const addToWatchlist = async (req, res) => {
  const { contentId } = req.params;
  const { type } = req.body;
  try {
    if (!['movie', 'series', 'anime'].includes(type)) {
      return res.status(400).json({ error: 'Invalid content type. Must be movie, series, or anime' });
    }
    req.user.watchlist.push({ contentId, type });
    await req.user.save();
    res.json({ message: 'Added to watchlist' });
  } catch (error) {
    res.status(500).json({ error: `Failed to add to watchlist: ${error.message}` });
  }
};

export const getWatchlist = async (req, res) => {
  res.json(req.user.watchlist);
};