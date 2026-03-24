import Product from '../models/Product.model.js';

function mapProduct(p) {
  const d = p && typeof p.toObject === 'function' ? p.toObject() : p;
  return {
    ...d,
    id: d._id,
    title: d.name,
    image: (d.images && d.images[0]) || d.image || ''
  };
}

export async function getAll(req, res) {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const products = await Product.find(filter).lean();
  const shuffled = products.sort(() => Math.random() - 0.5);
  res.status(200).json(shuffled.map(mapProduct));
}

export async function getById(req, res) {
  const product = await Product.findById(req.params.id).lean();
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(200).json(mapProduct(product));
}

export async function getByCategory(req, res) {
  const { category } = req.params;
  let filter = {};
  if (category === 'men') filter = { category: /men/i };
  else if (category === 'women') filter = { category: /women/i };
  else if (category === 'accessories') filter = { $or: [{ category: 'electronics' }, { category: 'jewelery' }] };
  const products = await Product.find(filter).lean();
  res.status(200).json(products.map(mapProduct));
}
