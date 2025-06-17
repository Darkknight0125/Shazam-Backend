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
import { validate, watchlistSchema } from '../middleware/validate.js';

const router = express.Router();

router.get('/movies/popular', rateLimit, getPopularMovies);
router.get('/movies/:movieId', rateLimit, getMovieDetails);
router.get('/anime/popular', rateLimit, getPopularAnime);
router.post('/watchlist/:contentId', authenticate, rateLimit, validate(watchlistSchema), addToWatchlist);
router.get('/watchlist', authenticate, getWatchlist);

export default router;