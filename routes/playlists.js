import express from 'express';
import { createPlaylist, getPlaylist } from '../controllers/playlistController.js';
import authenticate from '../middleware/auth.js';
import { validate, playlistSchema } from '../middleware/validate.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/', authenticate, rateLimit, validate(playlistSchema), createPlaylist);
router.get('/:id', authenticate, rateLimit, getPlaylist);

export default router;