import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../api/axiosConfig';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { cart, clearCart, removeFromCart } = useCart();

  const buyNowItems = location.state?.buyNowItems || null;

  const [checkoutItems, setCheckoutItems] = useState([]);

  useEffect(() => {
    const getInitialItems = () => {
      const sourceItems = (buyNowItems && Array.isArray(buyNowItems) && buyNowItems.length > 0) ? buyNowItems : (cart || []);
      return sourceItems.map(it => ({
        id: String(it.id),
        name: it.name,
        price: it.discountedPrice ?? it.price ?? 0,
        quantity: it.quantity ?? 1,
        image: it.images?.[0] || null,
      }));
    };
    setCheckoutItems(getInitialItems());
  }, [buyNowItems, cart]);

  const total = useMemo(() => {
    return checkoutItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  }, [checkoutItems]);

  const [customerInfo, setCustomerInfo] = useState({
    name: currentUser?.username || '',
    email: currentUser?.email || '',
    address: '',
    paymentMethod: 'card',
  });

  const handleRemoveItem = (itemId) => {
    setCheckoutItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => setCustomerInfo(prev => ({ ...prev, [field]: value }));

  const placeOrder = async () => {
    if (!currentUser) return;
    if (checkoutItems.length === 0) {
      setError('No items to checkout.');
      return;
    }
    if (!customerInfo.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!customerInfo.email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!customerInfo.address.trim()) {
      setError('Address is required to place an order.');
      return;
    }

    setError('');
    setPlacing(true);
    try {
      const orderPayload = {
        userId: String(currentUser.id),
        customerInfo,
        items: checkoutItems,
        total,
        orderDate: new Date().toISOString(),
        status: 'Pending',
      };

      const { data: newOrder } = await api.post('/orders', orderPayload);

      const stockUpdatePromises = checkoutItems.map(async (item) => {
        try {
          const { data: productToUpdate } = await api.get(`/products/${item.id}`);
          const newStock = productToUpdate.count - item.quantity;

          return api.patch(`/products/${item.id}`, { count: newStock });
        } catch (updateError) {
          console.error(`Failed to update stock for product ${item.id}:`, updateError);
        }
      });
      await Promise.all(stockUpdatePromises);

      if (!buyNowItems) {
        for (const item of checkoutItems) {
          removeFromCart(item.id);
        }
      }

      navigate('/order-success', { replace: true, state: { order: newOrder } });
    } catch (e) {
      console.error(e);
      setError('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-gray-600 mb-6">Your checkout has no items.</p>
        <button onClick={() => navigate('/products')} className="px-6 py-3 bg-black text-white rounded-lg">Go to Products</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Shipping & Payment</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input required value={customerInfo.name} onChange={e => updateField('name', e.target.value)} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" required value={customerInfo.email} onChange={e => updateField('email', e.target.value)} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea required value={customerInfo.address} onChange={e => updateField('address', e.target.value)} className="mt-1 w-full p-2 border rounded" rows={3} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select value={customerInfo.paymentMethod} onChange={e => updateField('paymentMethod', e.target.value)} className="mt-1 w-full p-2 border rounded">
                <option value="card">Card</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="mt-6 flex gap-4">
            <button disabled={placing} onClick={placeOrder} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60">
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
            <button onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">Back</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-4 max-h-80 overflow-auto pr-2">
            {checkoutItems.map((it, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img src={it.image || 'https://via.placeholder.com/80'} alt={it.name} className="w-16 h-16 rounded object-cover border" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{it.name}</p>
                  <p className="text-sm text-gray-500">Qty: {it.quantity}</p>
                  <button onClick={() => handleRemoveItem(it.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Remove
                  </button>
                </div>
                <div className="font-semibold">₹{(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          {buyNowItems && (
            <p className="text-xs text-gray-500 mt-2">Buy Now: only the selected item(s) will be ordered. Your cart remains unchanged.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
