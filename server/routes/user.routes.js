import express from 'express';
import * as user from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/profile', user.getProfile);
router.get('/recommended', user.getRecommended);
export default router;
