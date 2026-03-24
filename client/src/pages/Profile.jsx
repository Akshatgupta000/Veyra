import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orders as ordersApi } from '../services/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    ordersApi.getMyOrders().then((res) => setOrders(res.data || [])).catch(() => setOrders([]));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white text-gray-800 font-montserrat leading-relaxed">
      <section className="bg-soft-pink py-16 px-5 text-center">
        <h1 className="text-4xl font-semibold mb-5 text-black sm:text-3xl">My Account</h1>
        <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-base sm:text-sm">
          Manage your account details, view your orders, and update your preferences all in one place.
        </p>
      </section>
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-wrap gap-8 mb-12 md:flex-col">
          <main className="flex-grow min-w-[300px]">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8 sm:p-5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-semibold text-black relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-soft-pink">Profile Information</h3>
              </div>
              <div className="flex flex-wrap mb-4">
                <div className="w-38 font-medium text-gray-600 mr-5">Email</div>
                <div className="flex-1 min-w-[200px] text-gray-800">{user?.email || ''}</div>
              </div>
              <div className="flex flex-wrap mb-4">
                <div className="w-38 font-medium text-gray-600 mr-5">Phone Number</div>
                <div className="flex-1 min-w-[200px] text-gray-800">Not provided</div>
              </div>
              <div className="flex justify-between mt-5">
                <Link to="#" className="inline-block px-4 py-2 rounded border border-gray-800 text-gray-800 text-sm font-medium no-underline transition-all hover:bg-gray-800 hover:text-white mr-3">Update Profile</Link>
                <Link to="#" className="inline-block px-4 py-2 rounded border border-gray-800 text-gray-800 text-sm font-medium no-underline transition-all hover:bg-gray-800 hover:text-white mr-3">Change Password</Link>
                <button type="button" onClick={handleLogout} className="inline-block px-4 py-2 rounded bg-soft-pink text-white text-sm font-medium bg-gray-800 hover:text-white">Logout</button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-8 sm:p-5">
              <h3 className="text-xl font-semibold mb-5 text-black relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-soft-pink">Recent Orders</h3>
              {orders.length === 0 ? (
                <p className="text-gray-600">No recent orders found.</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left py-4 px-3 font-medium text-gray-600 border-b border-gray-100">Order</th>
                      <th className="text-left py-4 px-3 font-medium text-gray-600 border-b border-gray-100">Items</th>
                      <th className="text-left py-4 px-3 font-medium text-gray-600 border-b border-gray-100 md:table-cell sm:hidden">Date</th>
                      <th className="text-left py-4 px-3 font-medium text-gray-600 border-b border-gray-100">Total</th>
                      <th className="text-left py-4 px-3 font-medium text-gray-600 border-b border-gray-100 sm:hidden md:table-cell">Status</th>
                      <th className="text-left py-4 px-3 font-medium text-gray-600 border-b border-gray-100">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.order_id}>
                        <td className="py-4 px-3 border-b border-gray-100 font-medium text-gray-800">#{order.order_id}</td>
                        <td className="py-4 px-3 border-b border-gray-100">{order.item_count} items</td>
                        <td className="py-4 px-3 border-b border-gray-100 md:table-cell sm:hidden">{order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</td>
                        <td className="py-4 px-3 border-b border-gray-100">₹{Number(order.total_amount).toFixed(2)}</td>
                        <td className="py-4 px-3 border-b border-gray-100 sm:hidden md:table-cell"><span className="capitalize">{order.order_status || 'processing'}</span></td>
                        <td className="py-4 px-3 border-b border-gray-100">
                          <Link to={`/order-confirmation/${order.order_id}`} className="inline-block px-4 py-2 rounded border border-gray-800 text-gray-800 text-sm font-medium no-underline transition-all hover:bg-gray-800 hover:text-white">View Details</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </div>
      </div>
      <footer className="bg-soft-pink py-8 px-5 text-center mt-12">
        <p className="text-gray-600 text-sm">© 2025 VEYRA.co All Rights Reserved.</p>
      </footer>
    </div>
  );
}
