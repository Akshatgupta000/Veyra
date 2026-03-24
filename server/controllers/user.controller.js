import User from '../models/User.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';

export async function getProfile(req, res) {
  const user = await User.findById(req.user._id).select('name email phone').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json(user);
}

export async function getRecommended(req, res) {
  const orderCount = await Order.countDocuments({ userId: req.user._id });
  if (orderCount === 0) return res.status(200).json({ recommended: [], hasOrders: false });
  const recommended = await Product.aggregate([{ $sample: { size: 4 } }, { $project: { _id: 1, name: 1, price: 1, images: 1 } }]);
  const list = recommended.map(p => ({
    id: p._id,
    title: p.name,
    price: p.price,
    image: Array.isArray(p.images) && p.images[0] ? p.images[0] : ''
  }));
  res.status(200).json({ recommended: list, hasOrders: true });
}
