import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  verifyOtp: (otp) => api.post('/auth/verify-otp', { otp }),
  resendOtp: () => api.post('/auth/resend-otp'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyResetOtp: (otp) => api.post('/auth/verify-reset-otp', { otp }),
  resetPassword: (password, confirm_password) => api.post('/auth/reset-password', { password, confirm_password }),
  resendResetOtp: () => api.post('/auth/resend-reset-otp')
};

export const products = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`)
};

export const cart = {
  get: () => api.get('/cart'),
  add: (product_id, quantity = 1) => api.post('/cart/add', { product_id, quantity }),
  update: (cart_item_id, quantity) => api.post('/cart/update', { cart_item_id, quantity }),
  remove: (cart_item_id) => api.post('/cart/remove', { cart_item_id })
};

export const orders = {
  create: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders')
};

export const coupons = {
  validate: (code, bag_total) => api.post('/coupons/validate', { code, bag_total }),
  list: () => api.get('/coupons')
};

export const user = {
  getProfile: () => api.get('/user/profile'),
  getRecommended: () => api.get('/user/recommended')
};

export default api;
