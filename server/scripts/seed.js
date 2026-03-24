import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Coupon from '../models/Coupon.model.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veyra_ecommerce';

const sampleProducts = [
  { name: 'DARK FLORISH ONEPIECE', price: 250, category: "women's clothing", images: ['https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'] },
  { name: 'BAGGY SHIRT', price: 55, category: "men's clothing", images: ['https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'] },
  { name: 'COTTON OFF-WHITE SHIRT', price: 65, category: "men's clothing", images: ['https://images.unsplash.com/photo-1622445275576-721325763afe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'] },
  { name: 'CROP SWEATER', price: 50, category: "women's clothing", images: ['https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'] },
  { name: 'SUMMER DRESS', price: 75, category: "women's clothing", images: ['https://images.unsplash.com/photo-1583846783214-7229a91b20ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'] },
  { name: 'CASUAL BLAZER', price: 95, category: "men's clothing", images: ['https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'] },
  { name: 'Classic Watch', price: 120, category: 'jewelery', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'] },
  { name: 'Wireless Earbuds', price: 80, category: 'electronics', images: ['https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=500'] }
];

const sampleCoupons = [
  { code: 'SAVE10', discount: 10, isPercentage: true, minPurchase: 500, description: '10% off on orders above ₹500' },
  { code: 'FLAT50', discount: 50, isPercentage: false, minPurchase: 300, description: '₹50 off on orders above ₹300' }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Product.deleteMany({});
  await Coupon.deleteMany({});
  await Product.insertMany(sampleProducts);
  await Coupon.insertMany(sampleCoupons);
  console.log('Seed done: products and coupons added.');
  process.exit(0);
}
seed().catch((e) => { console.error(e); process.exit(1); });
