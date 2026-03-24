import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 flex flex-col items-center pt-8 pb-16">
        <div className="mb-8 text-4xl font-bold text-stone-700">VEYRA</div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-6 text-stone-800">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                <p className="text-sm">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-stone-700">Email address</label>
              <input type="email" id="email" name="email" required className="w-full p-2 border border-stone-200 rounded-md focus:border-stone-400 focus:ring-stone-400 focus:outline-none bg-stone-50" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="Password" className="block text-sm font-medium mb-1 text-stone-700">Password</label>
              <input type="password" id="Password" name="Password" required className="w-full p-2 border border-stone-200 rounded-md focus:border-stone-400 focus:ring-stone-400 focus:outline-none bg-stone-50" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-stone-700 hover:bg-stone-800 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out cursor-pointer">
              Sign In
            </button>
          </form>
          <div className="mt-4">
            <Link to="/forgot-password" className="text-sm text-stone-600 hover:text-stone-800 hover:underline">Forgot your password?</Link>
          </div>
          <hr className="my-6 border-stone-200" />
          <div className="text-center">
            <p className="text-sm text-stone-600 mb-4">New to VEYRA?</p>
            <Link to="/signup" className="block w-full py-2 px-4 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50 transition duration-300 ease-in-out text-sm text-center">
              Create your account
            </Link>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-center gap-6 text-sm mb-4">
            <a href="#" className="text-stone-600 hover:text-stone-800 hover:underline">Terms</a>
            <a href="#" className="text-stone-600 hover:text-stone-800 hover:underline">Privacy</a>
            <a href="#" className="text-stone-600 hover:text-stone-800 hover:underline">Help</a>
          </div>
          <p className="text-xs text-stone-500 text-center">© 2025 VEYRA. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
