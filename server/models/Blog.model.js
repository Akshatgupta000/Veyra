import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, default: '' },
  image: { type: String, default: '' },
  category: { type: String, default: '' },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
