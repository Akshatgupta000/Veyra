import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import mongoose from 'mongoose';

export async function createOrder(req, res) {
  const { shippingAddress, payment_method, source = 'cart', product_id, quantity: qty } = req.body;
  if (!shippingAddress || !payment_method) {
    return res.status(400).json({ message: 'Shipping address and payment method are required' });
  }
  const userId = req.user._id;
  let orderItems = [];
  let bagTotal = 0;

  if (source === 'direct' && product_id) {
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const quantity = Math.max(1, parseInt(qty, 10) || 1);
    orderItems = [{ productId: product._id, title: product.name, price: product.price, quantity, unitPrice: product.price }];
    bagTotal = product.price * quantity;
  } else {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }
    for (const it of cart.items) {
      const p = it.productId;
      if (!p) continue;
      orderItems.push({
        productId: p._id,
        title: p.name,
        price: p.price,
        quantity: it.quantity,
        unitPrice: p.price
      });
      bagTotal += p.price * it.quantity;
    }
  }

  const couponDiscount = req.body.coupon_discount ? parseFloat(req.body.coupon_discount) : 0;
  const totalAmount = Math.max(0, bagTotal - couponDiscount);

  const order = await Order.create({
    userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod: payment_method,
    status: 'processing',
    paymentStatus: 'pending'
  });

  if (source === 'cart') {
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
  }

  res.status(201).json({ orderId: order._id, total: totalAmount });
}

export async function getOrderById(req, res) {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id }).lean();
  if (!order) return res.status(404).json({ message: 'Order not found' });
  const totalPrice = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  res.status(200).json({ ...order, total_price: totalPrice });
}

export async function getMyOrders(req, res) {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10).lean();
  const list = orders.map(o => ({
    order_id: o._id,
    total_amount: o.totalAmount,
    payment_method: o.paymentMethod,
    order_status: o.status,
    created_at: o.createdAt,
    item_count: o.items.length,
    products: o.items.map(i => i.title).join(', ')
  }));
  res.status(200).json(list);
}
