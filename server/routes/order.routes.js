import express from 'express';
import * as order from '../controllers/order.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);
router.post('/', order.createOrder);
router.get('/', order.getMyOrders);
router.get('/:id', order.getOrderById);
export default router;
