import express from 'express';
import {
  createThread,
  createPost,
  getThreads,
} from '../controllers/forumController.js';
import authenticate from '../middleware/auth.js';
import { validate, threadSchema, postSchema } from '../middleware/validate.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/:contentId', authenticate, rateLimit, validate(threadSchema), createThread);
router.post('/:threadId/post', authenticate, rateLimit, validate(postSchema), createPost);
router.get('/:contentId', rateLimit, getThreads);

export default router;