import express from 'express';
import { createComment, getComments } from '../controllers/commentController.js';
import authenticate from '../middleware/auth.js';
import rateLimit from '../middleware/rateLimit.js';
import { validate, commentSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/', authenticate, rateLimit, validate(commentSchema), createComment);
router.get('/:contentId/:contentType', rateLimit, getComments);

export default router;