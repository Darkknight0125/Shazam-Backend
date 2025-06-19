import express from 'express';
import {
  createThread,
  createPost,
  getThread,
  upvotePost,
  downvotePost,
} from '../controllers/forumController.js';
import authenticate from '../middleware/auth.js';
import { validate, threadSchema, postSchema } from '../middleware/validate.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/', authenticate, rateLimit, validate(threadSchema), createThread);
router.post('/:threadId/post', authenticate, rateLimit, validate(postSchema), createPost);
router.get('/:threadId', rateLimit, getThread);
router.post('/:postId/upvote', authenticate, rateLimit, upvotePost);
router.post('/:postId/downvote', authenticate, rateLimit, downvotePost);

export default router;