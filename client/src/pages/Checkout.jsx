import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { user as userApi, products as productsApi, orders as ordersApi } from '../services/api';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const source = searchParams.get('source') || 'cart';
  const productId = searchParams.get('product_id');
  const quantity = parseInt(searchParams.get('quantity') || '1', 10);
  const couponDiscount = parseFloat(searchParams.get('coupon_discount') || '0');
  const bagTotalParam = parseFloat(searchParams.get('bag_total') || '0');
  const orderTotalParam = parseFloat(searchParams.get('order_total') || '0');

  const { items: cartItems, bagTotal: cartBagTotal } = useCart();
  const [user, setUser] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [bagTotal, setBagTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', zipcode: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentMethodErr, setPaymentMethodErr] = useState('');

  useEffect(() => {
    userApi.getProfile().then((res) => {
      const u = res.data;
      setUser(u);
      setForm((f) => ({ ...f, name: u.name || '', phone: u.phone || '' }));
    }).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (source === 'direct' && productId) {
      productsApi.getById(productId).then((res) => {
        const p = res.data;
        setOrderItems([{ productId: p.id || p._id, title: p.title, price: p.price, quantity }]);
        const bt = p.price * quantity;
        setBagTotal(bt);
        setTotalAmount(bt - couponDiscount);
      }).catch(() => setOrderItems([]));
    } else {
      setOrderItems(cartItems.map((i) => ({ productId: i.productId, title: i.title, price: i.price, quantity: i.quantity })));
      const bt = bagTotalParam > 0 ? bagTotalParam : cartBagTotal;
      setBagTotal(bt);
      setTotalAmount(orderTotalParam > 0 ? orderTotalParam : Math.max(0, bt - couponDiscount));
    }
  }, [source, productId, quantity, couponDiscount, bagTotalParam, orderTotalParam, cartItems, cartBagTotal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      setPaymentMethodErr('Payment method is required');
      return;
    }
    setPaymentMethodErr('');
    try {
      const res = await ordersApi.create({
        shippingAddress: form,
        payment_method: paymentMethod,
        source,
        product_id: source === 'direct' ? productId : undefined,
        quantity: source === 'direct' ? quantity : undefined,
        coupon_discount: couponDiscount
      });
      navigate(`/order-confirmation/${res.data.orderId}`);
    } catch (err) {
      setPaymentMethodErr(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Complete Your Order</h2>
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
            <form id="payment-form" className="space-y-4" method="POST" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="name" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" name="phone" required pattern="[0-9]{10}" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input type="text" name="address_line1" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50" value={form.address_line1} onChange={(e) => setForm((f) => ({ ...f, address_line1: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                <input type="text" name="address_line2" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50" value={form.address_line2} onChange={(e) => setForm((f) => ({ ...f, address_line2: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" name="city" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" name="state" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input type="text" name="zipcode" required pattern="[0-9]{6}" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50" value={form.zipcode} onChange={(e) => setForm((f) => ({ ...f, zipcode: e.target.value }))} />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-md p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-md p-4">
                    <div className="flex items-start">
                      <input type="radio" name="payment_method" value="cod" className="mt-1 mr-3" id="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                      <div>
                        <label htmlFor="cod" className="block font-medium">Cash on Delivery (COD)</label>
                        <p className="text-sm text-gray-600">Pay when you receive the order</p>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4">
                    <div className="flex items-start">
                      <input type="radio" name="payment_method" value="upi" className="mt-1 mr-3" id="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                      <div>
                        <label htmlFor="upi" className="block font-medium">UPI Payment</label>
                        <p className="text-sm text-gray-600">Instant payment using UPI</p>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-red-500">{paymentMethodErr}</span>
              </div>
              <button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-md font-medium uppercase tracking-wide">
                Complete Payment
              </button>
            </form>
          </div>
        </div>
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-white border border-gray-200 rounded-md p-6 sticky top-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-gray-600">{item.title} <span className="text-sm">x{item.quantity}</span></span>
                  <span>₹{Number(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{Number(bagTotal).toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{Number(couponDiscount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold mt-3">
                  <span>Total</span>
                  <span>₹{Number(totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Payment Security</h4>
              <div className="flex items-center text-sm text-gray-600">
                <i className="fas fa-lock text-green-500 mr-2"></i>
                <span>Secure SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
