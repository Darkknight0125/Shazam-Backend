import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { validate, signupSchema, loginSchema } from '../middleware/validate.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/signup', rateLimit, validate(signupSchema), signup);
router.post('/login', rateLimit, validate(loginSchema), login);

export default router;