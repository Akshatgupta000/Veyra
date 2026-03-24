import express from 'express';
import * as auth from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.post('/register', auth.register);
router.post('/verify-otp', auth.verifyOtp);
router.post('/resend-otp', auth.resendOtp);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.get('/me', authMiddleware, auth.me);
router.post('/forgot-password', auth.forgotPassword);
router.post('/verify-reset-otp', auth.verifyResetOtp);
router.post('/reset-password', auth.resetPassword);
router.post('/resend-reset-otp', auth.resendResetOtp);
export default router;
