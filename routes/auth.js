import express from 'express';
import { signup, login, editProfile, uploadProfilePicture, getProfile } from '../controllers/authController.js';
import { validate, signupSchema, loginSchema, profileSchema } from '../middleware/validate.js';
import rateLimit from '../middleware/rateLimit.js';
import authenticate from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/signup', rateLimit, validate(signupSchema), signup);
router.post('/login', rateLimit, validate(loginSchema), login);
router.patch('/profile', authenticate, rateLimit, validate(profileSchema), editProfile);
router.post('/profile/picture', authenticate, rateLimit, upload.single('profilePicture'), uploadProfilePicture);
router.get('/profile', authenticate, rateLimit, getProfile);

export default router;