import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth as authApi } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await authApi.forgotPassword(email);
      setSuccess(res.data.message || 'If your email exists in our system, you will receive a reset code shortly.');
      if (res.data.redirect) navigate('/reset-verify');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 flex flex-col items-center pt-8 pb-16">
        <div className="mb-8 text-4xl font-bold text-stone-700">VEYRA</div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-6 text-stone-800">Reset Your Password</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"><p className="text-sm">{error}</p></div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md"><p className="text-sm">{success}</p></div>}
            <p className="text-sm text-stone-600 mb-4">Enter your email address below and we&apos;ll send you a verification code to reset your password.</p>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-stone-700">Email address</label>
              <input type="email" id="email" name="email" required className="w-full p-2 border border-stone-200 rounded-md focus:border-stone-400 focus:ring-stone-400 focus:outline-none bg-stone-50" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-stone-700 hover:bg-stone-800 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out cursor-pointer">Send Reset Code</button>
          </form>
          <hr className="my-6 border-stone-200" />
          <div className="text-center">
            <Link to="/login" className="text-sm text-stone-600 hover:text-stone-800 hover:underline">Back to Sign In</Link>
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
