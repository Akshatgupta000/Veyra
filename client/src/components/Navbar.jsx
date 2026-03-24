import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'User';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase() || 'User';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full bg-rose-50 shadow-xl border-0 z-50">
        <div className="container-fluid px-2 sm:px-3 md:px-4 py-4 flex justify-between items-center">
          <div id="t1" className="text-3xl font-bold tracking-wider ml-2 md:ml-4">
            <Link to="/">VEYRA<sub>.co</sub></Link>
          </div>
          <button type="button" className="md:hidden flex items-center justify-center border border-gray-300 rounded p-2 mx-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <div><Link to="/" className="text-gray-700 hover:text-black flex items-center">HOME <i className="text-xs ml-1"></i></Link></div>
            <div><Link to="/shop" className="text-gray-700 hover:text-black flex items-center">SHOP <i className="text-xs ml-1"></i></Link></div>
            <div><Link to="/blog" className="text-gray-700 hover:text-black flex items-center">BLOG <i className="text-xs ml-1"></i></Link></div>
            <div><Link to="/contact" className="text-gray-700 hover:text-black flex items-center">CONTACT <i className="text-xs ml-1"></i></Link></div>
          </nav>
          <div className="flex items-center space-x-3 md:space-x-4 mr-2 md:mr-4">
            {!user && <Link to="/login" className="hidden md:block text-gray-700 hover:text-black">LOGIN</Link>}
            {user && (
              <div className="bg-stone-100 rounded-xl border-2 border-stone-200 p-2 flex items-center">
                <Link to="/profile" className="text-gray-700 hover:text-black flex text-lg items-center" aria-label="Profile">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {' '}{getInitials(user.name)}
                </Link>
              </div>
            )}
            {user && (
              <Link to="/cart" className="text-gray-700 hover:text-black flex text-xl items-center" aria-label="Cart">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
            )}
            {!user && (
              <Link to="/login" className="text-gray-700 hover:text-black flex text-xl items-center" aria-label="Cart">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
            )}
            <button type="button" className="text-gray-700 hover:text-black" aria-label="Search" onClick={() => { setSearchOpen(true); document.body.style.overflow = 'hidden'; }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <div id="mobile-menu" className={`${mobileOpen ? '' : 'hidden'} absolute top-16 left-0 right-0 bg-white shadow-md w-full md:hidden z-50`}>
            <nav className="flex flex-col py-3">
              <Link to="/" className="text-gray-700 hover:text-black py-2 px-4">HOME</Link>
              <Link to="/shop" className="text-gray-700 hover:text-black py-2 px-4">SHOP</Link>
              <Link to="/blog" className="text-gray-700 hover:text-black py-2 px-4">BLOG</Link>
              <Link to="/contact" className="text-gray-700 hover:text-black py-2 px-4">CONTACT</Link>
            </nav>
          </div>
        </div>
      </header>

      <div id="search-overlay" className={`fixed inset-0 bg-white z-50 transition-transform duration-500 ease-in-out ${searchOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="container mx-auto px-4 h-full flex flex-col">
          <div className="flex justify-center items-center py-16 md:py-24">
            <div className="w-full max-w-3xl relative">
              <input type="text" placeholder="Type and press enter" className="w-full px-4 py-3 text-xl border-b border-gray-300 focus:outline-none focus:border-black" onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)} />
              <button type="button" className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="text-center mt-8">
            <h3 className="uppercase text-sm tracking-wider text-gray-500 mb-6">Browse Categories</h3>
            <div className="text-2xl md:text-3xl space-x-2 md:space-x-4">
              <Link to="/men" onClick={() => setSearchOpen(false)} className="inline-block">Jackets</Link>
              <span className="text-gray-300">/</span>
              <Link to="/shop" onClick={() => setSearchOpen(false)} className="inline-block">T-shirts</Link>
              <span className="text-gray-300">/</span>
              <Link to="/accessories" onClick={() => setSearchOpen(false)} className="inline-block">Handbags</Link>
              <span className="text-gray-300">/</span>
              <Link to="/accessories" onClick={() => setSearchOpen(false)} className="inline-block">Accessories</Link>
              <span className="text-gray-300">/</span>
            </div>
            <div className="text-2xl md:text-3xl space-x-2 md:space-x-4 mt-4">
              <Link to="/women" onClick={() => setSearchOpen(false)} className="inline-block">Cosmetics</Link>
              <span className="text-gray-300">/</span>
              <Link to="/women" onClick={() => setSearchOpen(false)} className="inline-block">Dresses</Link>
              <span className="text-gray-300">/</span>
              <Link to="/shop" onClick={() => setSearchOpen(false)} className="inline-block">Jumpsuits</Link>
            </div>
          </div>
          <button type="button" className="absolute top-4 right-4 p-2" onClick={() => { setSearchOpen(false); document.body.style.overflow = ''; }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
