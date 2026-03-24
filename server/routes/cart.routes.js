import express from 'express';
import * as cart from '../controllers/cart.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/', cart.getCart);
router.post('/add', cart.addToCart);
router.post('/update', cart.updateCartItem);
router.post('/remove', cart.removeFromCart);
export default router;
