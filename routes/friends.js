import express from 'express';
import { sendFriendRequest, acceptFriendRequest, getFriendRequests, getFriends } from '../controllers/friendController.js';
import authenticate from '../middleware/auth.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/request/:userId', authenticate, rateLimit, sendFriendRequest);
router.post('/accept/:requestId', authenticate, rateLimit, acceptFriendRequest);
router.get('/requests', authenticate, rateLimit, getFriendRequests);
router.get('/', authenticate, rateLimit, getFriends);

export default router;