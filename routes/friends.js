import express from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  getChatHistory,
} from '../controllers/friendController.js';
import authenticate from '../middleware/auth.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/request/:userId', authenticate, rateLimit, sendFriendRequest);
router.post('/accept/:requestId', authenticate, rateLimit, acceptFriendRequest);
router.get('/chat/:friendId', authenticate, getChatHistory);

export default router;