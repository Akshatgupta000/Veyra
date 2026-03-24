import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth as authApi } from '../services/api';

export default function ResetVerify() {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await authApi.verifyResetOtp(otp);
      setOtpVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await authApi.resetPassword(password, confirmPassword);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.resendResetOtp();
      setSuccess('Verification code has been resent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend');
    }
  };

  if (otpVerified) {
    return (
      <div className="bg-stone-50 min-h-screen">
        <div className="container mx-auto px-4 flex flex-col items-center pt-8 pb-16">
          <div className="mb-8 text-4xl font-bold text-stone-700">VEYRA</div>
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-semibold mb-6 text-stone-800">Set New Password</h1>
            <form onSubmit={handleResetPassword} className="space-y-6">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"><p className="text-sm">{error}</p></div>}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 text-stone-700">New Password</label>
                <input type="password" id="password" name="password" required className="w-full p-2 border border-stone-200 rounded-md focus:border-stone-400 focus:ring-stone-400 focus:outline-none bg-stone-50" value={password} onChange={(e) => setPassword(e.target.value)} />
                <p className="text-xs text-stone-500 mt-1">Password must be at least 6 characters</p>
              </div>
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium mb-1 text-stone-700">Confirm New Password</label>
                <input type="password" id="confirm_password" name="confirm_password" required className="w-full p-2 border border-stone-200 rounded-md focus:border-stone-400 focus:ring-stone-400 focus:outline-none bg-stone-50" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-stone-700 hover:bg-stone-800 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out cursor-pointer">Reset Password</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 flex flex-col items-center pt-8 pb-16">
        <div className="mb-8 text-4xl font-bold text-stone-700">VEYRA</div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-6 text-stone-800">Verify Your Email</h1>
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"><p className="text-sm">{error}</p></div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md"><p className="text-sm">{success}</p></div>}
            <p className="text-sm text-stone-600">We sent a verification code to your email. Please enter the code below.</p>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium mb-1 text-stone-700">Verification Code</label>
              <input type="text" id="otp" name="otp" required maxLength={6} className="w-full p-2 border border-stone-200 rounded-md focus:border-stone-400 focus:ring-stone-400 focus:outline-none bg-stone-50" value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-stone-700 hover:bg-stone-800 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out cursor-pointer">Verify Code</button>
            <div className="text-center mt-4">
              <button type="button" onClick={handleResendOtp} className="text-sm text-stone-600 hover:text-stone-800 hover:underline">Didn&apos;t receive the code? Resend</button>
            </div>
          </form>
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
