import express from 'express';
import { createPlaylist, getPlaylist, addMediaToPlaylist, togglePlaylistPublic } from '../controllers/playlistController.js';
import authenticate from '../middleware/auth.js';
import { validate, playlistSchema, mediaSchema } from '../middleware/validate.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/', authenticate, rateLimit, validate(playlistSchema), createPlaylist);
router.get('/:id', authenticate, rateLimit, getPlaylist);
router.post('/:id/add', authenticate, rateLimit, validate(mediaSchema), addMediaToPlaylist);
router.patch('/:id/toggle-public', authenticate, rateLimit, togglePlaylistPublic);

export default router;