import express from 'express';
import * as coupon from '../controllers/coupon.controller.js';

const router = express.Router();
router.post('/validate', coupon.validateCoupon);
router.get('/', coupon.listCoupons);
export default router;
