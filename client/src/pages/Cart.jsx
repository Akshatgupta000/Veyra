import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { coupons as couponsApi } from '../services/api';

export default function Cart() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const { items, bagTotal, totalItems, updateQuantity, removeItem, fetchCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);

  const orderTotal = Math.max(0, bagTotal - couponDiscount);

  useEffect(() => {
    couponsApi.list().then((res) => setCoupons(res.data || [])).catch(() => setCoupons([]));
  }, []);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const res = await couponsApi.validate(couponCode.trim(), bagTotal);
      if (res.data.applied) {
        setCouponDiscount(res.data.discount);
        setAppliedCoupon({ code: res.data.code, description: res.data.description });
        setCouponMessage('');
      }
    } catch (err) {
      setCouponMessage(err.response?.data?.message || 'Invalid coupon code.');
      setCouponDiscount(0);
      setAppliedCoupon(null);
    }
  };

  const handleQuantityChange = async (itemId, qty) => {
    await updateQuantity(itemId, parseInt(qty, 10));
  };

  const handleRemove = async (itemId) => {
    await removeItem(itemId);
  };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">My Bag <span id="itemCount" className="text-gray-500 font-normal text-lg">({totalItems} item{totalItems !== 1 ? 's' : ''})</span></h2>

        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="lg:flex lg:space-x-8">
          <div className="lg:w-2/3">
            {items.length === 0 ? (
              <div className="border border-gray-200 rounded-md mb-4 p-6 text-center">
                <p className="text-gray-600 mb-4">Your bag is empty.</p>
                <Link to="/" className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-md font-medium">Continue Shopping</Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-md mb-4 p-4 flex flex-col md:flex-row" data-id={item.id}>
                  <div className="flex-shrink-0 w-full md:w-32 h-40 bg-gray-100 rounded-md overflow-hidden mb-4 md:mb-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover object-center" />
                  </div>
                  <div className="flex-grow md:ml-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                      <div className="flex items-center mb-3">
                        <p className="item-price text-secondary font-medium">₹ {Number(item.price).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium mr-3">Qty:</span>
                        <select className="quantity-select border border-gray-300 rounded-md px-2 py-1 text-sm" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, e.target.value)}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex mt-3">
                      <button type="button" onClick={() => handleRemove(item.id)} className="text-red-500 text-sm font-medium mr-4">
                        <i className="far fa-trash-alt mr-1"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <h3 className="text-xl font-semibold mb-4">Order Details</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bag Total</span>
                  <span id="bagTotal">₹{Number(bagTotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">Convenience Fee <span className="text-blue-500 text-xs ml-1 cursor-pointer">What&apos;s this?</span></span>
                  <span className="font-medium">₹0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-green-600">Free <span className="line-through text-gray-400 text-sm">₹99.00</span></span>
                </div>
                {couponDiscount > 0 && (
                  <div id="couponDiscount" className="flex justify-between text-green-600">
                    <span>Coupon discount</span>
                    <span id="couponDiscountValue">-₹{Number(couponDiscount).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                  <span>Order Total</span>
                  <span id="orderTotal">₹{Number(orderTotal).toFixed(2)}</span>
                </div>
              </div>

              <Link to={{ pathname: '/checkout', search: appliedCoupon ? `?coupon_code=${appliedCoupon.code}&coupon_discount=${couponDiscount}&bag_total=${bagTotal}&order_total=${orderTotal}&source=cart` : '?source=cart' }} className="block w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-md font-medium uppercase tracking-wide text-center">
                Proceed to Shipping
              </Link>

              <div className="mt-6 border border-gray-200 rounded-md p-4">
                <h4 className="font-medium mb-3">Apply Coupon</h4>
                <form onSubmit={handleApplyCoupon} className="flex">
                  <input type="text" name="coupon_code" id="couponInput" placeholder="Enter coupon code" className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-secondary" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                  <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-r-md text-sm font-medium">APPLY</button>
                </form>
                {couponMessage && <div id="couponMessage" className="mt-2 text-sm text-red-500">{couponMessage}</div>}
                {appliedCoupon && <div className="mt-2 text-sm text-green-600">Coupon applied: {appliedCoupon.description}</div>}
                {coupons.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Applicable Coupons</h5>
                    <div className="space-y-3">
                      {coupons.map((coupon, index) => (
                        <div key={coupon._id || index} className="flex items-start">
                          <input type="radio" id={`coupon${index}`} name="coupon" className="coupon-radio mt-1 mr-2" checked={appliedCoupon?.code === coupon.code} readOnly />
                          <div>
                            <label htmlFor={`coupon${index}`} className="block font-medium text-sm">
                              Savings: {coupon.isPercentage ? `${coupon.discount}%` : `₹${Number(coupon.discount).toFixed(2)}`}
                            </label>
                            <p className="text-sm text-gray-600">{coupon.code}</p>
                            <p className="text-xs text-gray-500">{coupon.description}</p>
                            {coupon.minPurchase > 0 && <p className="text-xs text-gray-500">Minimum purchase: ₹{Number(coupon.minPurchase).toFixed(2)}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Return/Refund policy</h4>
                <p className="text-sm text-gray-600">In case of return, we ensure quick refunds. Full amount will be refunded excluding Convenience Fee.</p>
                <a href="#" className="text-sm text-blue-500 mt-1 inline-block">Read Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 border-t border-gray-200 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 mb-2"><i className="fas fa-shield-alt text-xl text-gray-600"></i></div>
            <span className="text-sm font-medium uppercase">Secure Payments</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 mb-2"><i className="fas fa-exchange-alt text-xl text-gray-600"></i></div>
            <span className="text-sm font-medium uppercase">Easy Exchange</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 mb-2"><i className="fas fa-check-circle text-xl text-gray-600"></i></div>
            <span className="text-sm font-medium uppercase">Assured Quality</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 mb-2"><i className="fas fa-sync-alt text-xl text-gray-600"></i></div>
            <span className="text-sm font-medium uppercase">Free Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
