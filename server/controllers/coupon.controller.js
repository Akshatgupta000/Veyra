import Coupon from '../models/Coupon.model.js';

export async function validateCoupon(req, res) {
  const { code, bag_total } = req.body;
  if (!code) return res.status(400).json({ message: 'Coupon code is required' });
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return res.status(400).json({ message: 'Invalid coupon code.', applied: false });
  const total = parseFloat(bag_total) || 0;
  if (coupon.minPurchase && total < coupon.minPurchase) {
    return res.status(400).json({
      message: `Minimum purchase of ₹${coupon.minPurchase.toFixed(2)} required for this coupon.`,
      applied: false
    });
  }
  let discount = coupon.isPercentage ? (total * coupon.discount / 100) : coupon.discount;
  if (discount > total) discount = total;
  res.status(200).json({
    applied: true,
    code: coupon.code,
    description: coupon.description,
    discount,
    orderTotal: total - discount
  });
}

export async function listCoupons(req, res) {
  const coupons = await Coupon.find({ isActive: true }).sort({ discount: -1 }).lean();
  res.status(200).json(coupons);
}
