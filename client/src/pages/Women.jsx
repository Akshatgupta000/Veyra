import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products as productsApi } from '../services/api';

export default function Women() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productsApi.getByCategory('women').then((res) => setProducts(res.data || [])).catch(() => setProducts([]));
  }, []);

  return (
    <div className="bg-pink-50">
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-gray-600 mr-3 font-medium">Filter by:</span>
              <div className="flex flex-wrap gap-2">
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300">
                  <option>All Categories</option>
                  <option>Men&apos;s Clothing</option>
                  <option>Women&apos;s Clothing</option>
                  <option>Jewelry</option>
                  <option>Electronics</option>
                </select>
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300">
                  <option>Price Range</option>
                  <option>Under $25</option>
                  <option>$25 - $50</option>
                  <option>$50 - $100</option>
                  <option>$100+</option>
                </select>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-3 font-medium">Sort by:</span>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center">
              All Products
              <button type="button" className="ml-1 text-gray-500 hover:text-gray-700"><i className="fas fa-times"></i></button>
            </span>
          </div>
        </div>
      </div>

      <section id="new-arrivals" className="container mx-auto px-4 mb-16">
        <h2 className="section-title text-2xl md:text-3xl font-bold text-gray-800 mb-8">Our Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id || product._id} className="product-card bg-white overflow-hidden shadow-md">
              <div className="product-image-wrapper border-b border-gray-100">
                <img src={product.image} alt={product.title} className="product-image" />
                <div className="absolute top-2 left-2">
                  <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded-full text-xs font-medium">
                    {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : ''}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 h-10">
                  <Link to={`/product/${product.id || product._id}`} className="hover:text-blue-600 transition-colors">{product.title}</Link>
                </h3>
                <div className="flex flex-col space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">₹{Number(product.price).toFixed(2)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/checkout?product_id=${product.id || product._id}&quantity=1&source=direct`} className="w-full bg-rose-600 text-white py-2 px-3 text-sm uppercase tracking-wider hover:bg-rose-700 transition-colors text-center">
                      Buy Now
                    </Link>
                    <button type="button" onClick={() => addToCart(product.id || product._id, 1)} className="w-full bg-black text-white py-2 px-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
