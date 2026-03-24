import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { user as userApi, products as productsApi } from '../services/api';

export default function Home() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [userHasOrders, setUserHasOrders] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    productsApi.getAll().then((res) => setNewArrivals((res.data || []).slice(0, 6))).catch(() => setNewArrivals([]));
  }, []);

  useEffect(() => {
    if (!user) return;
    userApi.getRecommended().then((res) => {
      setRecommendedProducts(res.data.recommended || []);
      setUserHasOrders(res.data.hasOrders || false);
    }).catch(() => {});
  }, [user]);

  const itemsPerView = typeof window !== 'undefined' ? (window.innerWidth < 640 ? 1 : window.innerWidth < 768 ? 2 : 4) : 4;
  const maxIndex = Math.max(0, newArrivals.length - itemsPerView);

  const slidePrev = () => setCarouselIndex((i) => Math.max(0, i - 1));
  const slideNext = () => setCarouselIndex((i) => Math.min(maxIndex, i + 1));
  const offset = -(carouselIndex * (100 / 4));

  return (
    <>
      <div className="bg-rose-100 p-16 mt-20 text-center">
        <h1 id="t2" className="text-5xl mb-8 font-sans font-marcellus">New Collections</h1>
        <p className="max-w-2xl mx-auto text-gray-500 px-4">
          Discover the latest trends in our new collection. From stylish apparel to must-have accessories, find everything you need to elevate your wardrobe. Shop now and redefine your style with our exclusive range!
        </p>
      </div>

      <div id="recommended-products" className="bg-white px-4 md:px-8 lg:px-4 container mx-auto py-8" style={{ display: userHasOrders && recommendedProducts.length ? 'block' : 'none' }}>
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 id="t2" className="text-3xl font-bold tracking-wide text-gray-900 font-marcellus">RECOMMENDED FOR YOU</h2>
            <Link to="/shop" className="uppercase text-sm tracking-wider text-gray-700 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((recm) => (
              <div key={recm.id} className="p-4">
                <div className="mb-4">
                  <img src={recm.image} alt={recm.title} className="w-full h-64 md:h-80 object-cover" />
                </div>
                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 h-10">
                  <Link to={`/product/${recm.id}`} className="hover:text-blue-600 transition-colors">{recm.title}</Link>
                </h3>
                <div className="flex flex-col space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">₹{Number(recm.price).toFixed(2)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/checkout?product_id=${recm.id}&quantity=1&source=direct`} className="w-full bg-rose-600 text-white py-2 px-3 text-sm uppercase tracking-wider hover:bg-rose-700 transition-colors text-center">
                      Buy Now
                    </Link>
                    <button type="button" onClick={() => addToCart(recm.id, 1)} className="w-full bg-black text-white py-2 px-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-20 py-10 space-y-8 md:space-y-0" style={{ display: userHasOrders && recommendedProducts.length ? 'none' : 'flex' }}>
        <div className="text-center w-full md:w-1/4 mx-4">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 id="t2" className="text-xl font-bold mb-2 font-marcellus">Book An Appointment</h1>
          <p className="text-gray-500 text-sm">Discover a seamless shopping experience tailored to your needs. Schedule a personalized session with our fashion experts today!</p>
        </div>
        <div className="text-center w-full md:w-1/4 mx-4">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Pick Up In Store</h1>
          <p className="text-gray-500 text-sm">Enjoy the convenience of picking up your curated fashion pieces at your nearest store. Shop effortlessly today!</p>
        </div>
        <div className="text-center w-full md:w-1/4 mx-4">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Special Packaging</h1>
          <p className="text-gray-500 text-sm">Make your gifts unforgettable with our exclusive packaging options. Perfect for every special occasion!</p>
        </div>
        <div className="text-center w-full md:w-1/4 mx-4">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Free Global Returns</h1>
          <p className="text-gray-500 text-sm">Shop with confidence knowing you can return your fashion finds effortlessly, no matter where you are!</p>
        </div>
      </div>

      <div className="bg-rose-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 p-6 md:p-8">
          <div className="group cursor-pointer text-center">
            <Link to="/men">
              <div className="overflow-hidden mb-3">
                <img src="/photos/cat-item1.jpg" alt="Men's Fashion" className="w-full transition-transform duration-500 group-hover:scale-95" />
              </div>
              <p className="uppercase text-gray-500 tracking-wider text-sm md:text-base font-light">Shop for men</p>
            </Link>
          </div>
          <div className="group cursor-pointer text-center">
            <Link to="/women">
              <div className="overflow-hidden mb-3">
                <img src="/photos/cat-item2.jpg" alt="Women's Fashion" className="w-full transition-transform duration-500 group-hover:scale-95" />
              </div>
              <p className="uppercase text-gray-500 tracking-wider text-sm md:text-base">Shop for women</p>
            </Link>
          </div>
          <div className="group cursor-pointer text-center">
            <Link to="/accessories">
              <div className="overflow-hidden mb-3">
                <img src="/photos/cat-item3.jpg" alt="Accessories" className="w-full transition-transform duration-500 group-hover:scale-95" />
              </div>
              <p className="uppercase text-gray-500 tracking-wider text-sm md:text-base font-light">Shop accessories</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="font-serif">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold tracking-wide text-gray-900">OUR NEW ARRIVALS</h2>
            <Link to="/shop" className="uppercase text-sm tracking-wider text-gray-700 hover:underline">View all products</Link>
          </div>
          <div className="relative overflow-hidden">
            <button type="button" className="arrow-btn absolute left-0 top-1/2 z-10 bg-white bg-opacity-70 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-opacity-100 transition" onClick={slidePrev}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="carousel-container overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${offset}%)` }}>
                {newArrivals.map((product) => (
                  <div key={product.id || product._id} className="w-full sm:w-1/2 md:w-1/4 flex-shrink-0 px-2">
                    <img src={product.image} alt={product.title || product.name} className="w-full h-96 object-cover mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">{product.title || product.name}</h3>
                    <div className="mt-2 mb-3 font-bold">
                      <span className="text-gray-700">₹{Number(product.price).toFixed(2)}</span>
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
                ))}
              </div>
            </div>
            <button type="button" className="arrow-btn absolute right-0 top-1/2 z-10 bg-white bg-opacity-70 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-opacity-100 transition" onClick={slideNext}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 pt-10">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row bg-white overflow-hidden">
            <div className="w-full md:w-1/2">
              <img src="/photos/single-image-2.jpg" alt="Classic Winter Collection" className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-wide">
                CLASSIC WINTER<br />COLLECTION
              </h1>
              <p className="text-gray-600 mb-8">
                Embrace the warmth and elegance of our Classic Winter Collection. Designed to keep you cozy and stylish, each piece is crafted with premium materials and timeless designs. Elevate your winter wardrobe with our exclusive range, perfect for every occasion.
              </p>
              <div>
                <Link to="/shop" className="inline-block bg-black text-white px-8 py-3 uppercase font-medium tracking-wide hover:bg-gray-800 transition duration-300">
                  Shop Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-200 to-pink-900 py-16 mb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Our Newsletter</h3>
            <p className="text-gray-700 mb-8">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent" />
              <button type="submit" className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors shadow-md font-medium">
                Subscribe Now
              </button>
            </form>
            <p className="text-xs text-gray-600 mt-4">By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.</p>
          </div>
        </div>
      </div>
    </>
  );
}
