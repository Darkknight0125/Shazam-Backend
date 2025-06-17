import express from 'express';
import { chat, getSuggestions } from '../controllers/aiController.js';
import authenticate from '../middleware/auth.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/chat', authenticate, rateLimit, chat);
router.get('/suggestions', authenticate, rateLimit, getSuggestions);

export default router;