import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController.js';
import authenticate from '../middleware/auth.js';
import rateLimit from '../middleware/rateLimit.js';
import { validate, messageSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/send/:receiverId', authenticate, rateLimit, validate(messageSchema), sendMessage);
router.get('/history/:friendId', authenticate, rateLimit, getChatHistory);

export default router;