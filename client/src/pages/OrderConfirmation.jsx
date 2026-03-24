import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders as ordersApi } from '../services/api';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    ordersApi.getById(orderId).then((res) => setOrder(res.data)).catch(() => setOrder(null));
  }, [orderId]);

  if (!order) return <div className="min-h-screen flex items-center justify-center p-4">Loading...</div>;

  const totalPrice = order.total_price ?? order.items?.reduce((s, i) => s + (i.unitPrice || i.price) * i.quantity, 0) ?? order.totalAmount;
  const shippingAddress = typeof order.shippingAddress === 'object' ? order.shippingAddress : {};

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">Thank you for your purchase. Your order has been received and is being processed.</p>
        </div>
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">#{orderId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-medium">₹{Number(totalPrice).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">{(order.paymentMethod || order.payment_method || '').toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Status:</span>
            <span className="font-medium uppercase">{order.status || order.order_status || 'processing'}</span>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Order Details</h2>
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="flex justify-between mb-2">
              <span className="text-gray-600">{item.title} <span className="text-sm">(x{item.quantity})</span></span>
              <span>₹{Number((item.unitPrice || item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Shipping Address</h2>
          <p className="text-gray-700">
            {shippingAddress.name || ''}<br />
            {shippingAddress.address_line1 || shippingAddress.line1 || ''}<br />
            {shippingAddress.address_line2 || shippingAddress.line2 ? <>{shippingAddress.address_line2 || shippingAddress.line2}<br /></> : null}
            {shippingAddress.city || ''}, {shippingAddress.state || ''} - {shippingAddress.zipcode || ''}
          </p>
        </div>
        <div className="text-center">
          <Link to="/shop" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded transition-colors">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
