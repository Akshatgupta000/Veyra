import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth as authApi } from '../services/api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { verifyOtp, resendOtp, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await authApi.register(name, email, password);
      setSuccess('Verification code sent to your email.');
      setShowOtpForm(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.verifyOtp(otp);
      await refreshUser();
      setSuccess('Account created successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.resendOtp();
      setSuccess('OTP has been resent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  if (showOtpForm) {
    return (
      <div className="bg-stone-50 min-h-screen">
        <div className="flex flex-col items-center pt-8 pb-16">
          <div className="mb-4 text-4xl font-bold text-stone-700">VEYRA</div>
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-semibold mb-1 text-stone-800">Create Account</h1>
            <p className="text-sm mb-6 text-stone-600">Enter verification code</p>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium mb-1 text-stone-700">Enter verification code</label>
                <input type="text" id="otp" name="otp" placeholder="6-digit code" required className="w-full p-2 border border-stone-200 rounded-md focus:border-stone-400 focus:ring-stone-400 focus:outline-none bg-stone-50" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-stone-700 hover:bg-stone-800 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out mb-4 cursor-pointer">Verify</button>
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-500">Didn&apos;t receive a code?</p>
                <button type="button" onClick={handleResendOtp} className="text-xs text-stone-700 hover:text-stone-900 hover:underline">Resend code</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="flex flex-col items-center pt-8 pb-16">
        <div className="mb-4 text-4xl font-bold text-stone-700">VEYRA</div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-1 text-stone-800">Create Account</h1>
          <p className="text-sm mb-6 text-stone-600">All fields are required</p>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-stone-700">Your name</label>
              <input type="text" id="name" name="name" placeholder="First and last name" required className="w-full p-2 border border-stone-200 rounded-md focus:border-stone-400 focus:ring-stone-400 focus:outline-none bg-stone-50" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-stone-700">Email address</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" required className="w-full p-2 border border-stone-200 rounded-md focus:border-stone-400 focus:ring-stone-400 focus:outline-none bg-stone-50" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-2">
              <label htmlFor="Password" className="block text-sm font-medium mb-1 text-stone-700">Password</label>
              <input type="password" id="Password" placeholder="At least 6 characters" name="Password" required className="w-full p-2 border border-stone-200 rounded-md focus:border-stone-400 focus:ring-stone-400 focus:outline-none bg-stone-50" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="ml-2 text-xs text-stone-600">Passwords must be at least 6 characters.</p>
            </div>
            <button type="submit" className="w-full bg-stone-700 hover:bg-stone-800 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out mb-6 cursor-pointer">Create your account</button>
            <hr className="mb-6 border-stone-200" />
            <div className="text-center mb-4">
              <p className="text-sm text-stone-600">Already have an account? <Link to="/login" className="text-stone-700 hover:text-stone-900 hover:underline">Sign in</Link></p>
            </div>
            <div className="text-xs text-stone-500 text-center">
              <p>By creating an account, you agree to VEYRA&apos;s <a href="#" className="text-stone-700 hover:text-stone-900 hover:underline">Conditions of Use</a> and <a href="#" className="text-stone-700 hover:text-stone-900 hover:underline">Privacy Policy</a>.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
