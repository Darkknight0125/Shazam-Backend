import express from 'express';
import { createOrUpdateRating, getRatings, getUserRatings, getAverageRating } from '../controllers/ratingController.js';
import authenticate from '../middleware/auth.js';
import rateLimit from '../middleware/rateLimit.js';
import { validate, ratingSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/', authenticate, rateLimit, validate(ratingSchema), createOrUpdateRating);
router.get('/:contentId/:contentType', rateLimit, getRatings);
router.get('/user', authenticate, rateLimit, getUserRatings);
router.get('/average/:contentId/:contentType', rateLimit, getAverageRating);

export default router;