import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { sendOTP, sendResetOTP } from '../utils/sendOTP.js';

const COOKIE_OPTIONS = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 };

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists. Please use a different email or login.' });
    }
    const otp = generateOtp();
    // Set expiry to 10 minutes from now
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const user = await User.create({ name, email, password, isVerified: false, otp, otpExpires });
    await sendOTP(email, otp);
    const tempToken = jwt.sign({ userId: user._id, purpose: 'otp' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.cookie('otp_flow', tempToken, { httpOnly: true, maxAge: 15 * 60 * 1000, sameSite: 'lax' });
    res.status(200).json({ success: true, message: 'Verification code sent to your email.', showOtpForm: true });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { otp } = req.body;
    const tempToken = req.cookies?.otp_flow;
    if (!tempToken) return res.status(400).json({ success: false, message: 'Session expired. Please register again.' });
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Session expired. Please register again.' });
    }
    const user = await User.findById(decoded.userId);
    if (!user || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }
    if (user.otpExpires && user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.clearCookie('otp_flow');
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: 'Account created successfully!', data: { user: { _id: user._id, name: user.name, email: user.email } } });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function resendOtp(req, res) {
  try {
    const tempToken = req.cookies?.otp_flow;
    if (!tempToken) return res.status(400).json({ success: false, message: 'Session expired. Please register again.' });
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Session expired. Please register again.' });
    }
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ success: false, message: 'User not found.' });
    
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    
    await sendOTP(user.email, otp);
    res.status(200).json({ success: true, message: 'OTP has been resent to your email.' });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in.', requiresVerification: true });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: 'Logged in successfully', data: { user: { _id: user._id, name: user.name, email: user.email } } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function me(req, res) {
  try {
    res.status(200).json({ success: true, data: { user: req.user } });
  } catch (error) {
    console.error("Me Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If your email exists in our system, you will receive a reset code shortly.' });
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendResetOTP(email, otp);
    const resetToken = jwt.sign({ userId: user._id, purpose: 'reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.cookie('reset_flow', resetToken, { httpOnly: true, maxAge: 15 * 60 * 1000, sameSite: 'lax' });
    res.status(200).json({ success: true, message: 'Reset code sent.', redirect: true });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function verifyResetOtp(req, res) {
  try {
    const { otp } = req.body;
    const resetToken = req.cookies?.reset_flow;
    if (!resetToken) return res.status(400).json({ success: false, message: 'Session expired. Please request a new code.' });
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }
    const user = await User.findById(decoded.userId);
    if (!user || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please try again.' });
    }
    if (user.otpExpires && user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    const verifyToken = jwt.sign({ userId: user._id, purpose: 'reset_verified' }, process.env.JWT_SECRET, { expiresIn: '10m' });
    res.cookie('reset_verified', verifyToken, { httpOnly: true, maxAge: 10 * 60 * 1000, sameSite: 'lax' });
    res.status(200).json({ success: true, message: 'Verified', otpVerified: true });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { password, confirm_password } = req.body;
    const verifyToken = req.cookies?.reset_verified;
    if (!verifyToken) return res.status(400).json({ success: false, message: 'Please verify your email first.' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    if (password !== confirm_password) return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    let decoded;
    try {
      decoded = jwt.verify(verifyToken, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Session expired. Please verify again.' });
    }
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ success: false, message: 'User not found.' });
    user.password = password;
    await user.save();
    res.clearCookie('reset_flow');
    res.clearCookie('reset_verified');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: 'Password reset successfully.', data: { user: { _id: user._id, name: user.name, email: user.email } } });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function resendResetOtp(req, res) {
  try {
    const resetToken = req.cookies?.reset_flow;
    if (!resetToken) return res.status(400).json({ success: false, message: 'Session expired. Please request a new code.' });
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Session expired. Please request a new code.' });
    }
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ success: false, message: 'User not found.' });
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendResetOTP(user.email, otp);
    res.status(200).json({ success: true, message: 'Verification code has been resent to your email.' });
  } catch (error) {
    console.error("Resend Reset OTP Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
