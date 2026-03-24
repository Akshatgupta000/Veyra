import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export async function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return next();
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err && decoded) req.userId = decoded.userId;
    next();
  });
}
