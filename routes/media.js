import express from 'express';
import {
  getPopularMovies,
  getMovieDetails,
  getPopularAnime,
  addToWatchlist,
  getWatchlist,
} from '../controllers/mediaController.js';
import authenticate from '../middleware/auth.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

router.get('/movies/popular', rateLimit, getPopularMovies);
router.get('/movies/:movieId', rateLimit, getMovieDetails);
router.get('/anime/popular', rateLimit, getPopularAnime);
router.post('/watchlist/:contentId', authenticate, addToWatchlist);
router.get('/watchlist', authenticate, getWatchlist);

export default router;