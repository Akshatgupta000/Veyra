import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import mongoose from 'mongoose';

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

export async function getCart(req, res) {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId').lean();
  if (!cart) return res.status(200).json({ items: [], bagTotal: 0, totalItems: 0 });
  const items = cart.items.map((it) => {
    const p = it.productId;
    if (!p) return null;
    const img = p.images && p.images[0] ? p.images[0] : (p.image || '');
    return {
      id: it._id.toString(),
      productId: p._id,
      quantity: it.quantity,
      title: p.name,
      price: p.price,
      image: img
    };
  }).filter(Boolean);
  let bagTotal = 0;
  let totalItems = 0;
  items.forEach(i => {
    bagTotal += i.price * i.quantity;
    totalItems += i.quantity;
  });
  res.status(200).json({ items, bagTotal, totalItems });
}

export async function addToCart(req, res) {
  const { product_id, quantity = 1 } = req.body;
  const qty = Math.min(10, Math.max(1, parseInt(quantity, 10) || 1));
  if (!product_id) return res.status(400).json({ message: 'Invalid product or quantity' });
  const product = await Product.findById(product_id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });
  const existing = cart.items.find(i => i.productId.toString() === product_id);
  if (existing) {
    existing.quantity = Math.min(10, existing.quantity + qty);
  } else {
    cart.items.push({ productId: product_id, quantity: qty });
  }
  await cart.save();
  res.status(200).json({ message: 'Product added to cart successfully!' });
}

export async function updateCartItem(req, res) {
  const { cart_item_id, quantity } = req.body;
  const qty = Math.min(10, Math.max(1, parseInt(quantity, 10) || 1));
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const item = cart.items.id(cart_item_id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.quantity = qty;
  await cart.save();
  res.status(200).json({ message: 'Cart updated successfully!' });
}

export async function removeFromCart(req, res) {
  const { cart_item_id } = req.body;
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items.pull(cart_item_id);
  await cart.save();
  res.status(200).json({ message: 'Item removed from cart successfully!' });
}
