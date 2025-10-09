import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

// --- Icon Components for a richer UI ---
const PackageIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
const TruckIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 0v1.125c0 .621-.504 1.125-1.125 1.125H4.5A1.125 1.125 0 013.375 18v-1.125" /></svg>;
const HomeIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
const CheckCircleIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;

// --- Modern Order Tracker Component ---
const OrderTracker = ({ status }) => {
  const statuses = [
    { name: 'Pending', icon: <PackageIcon className="w-6 h-6" /> },
    { name: 'Shipped', icon: <TruckIcon className="w-6 h-6" /> },
    { name: 'Delivered', icon: <HomeIcon className="w-6 h-6" /> }
  ];
  const currentStatusIndex = statuses.findIndex(s => s.name === status);

  if (status === 'Cancelled') {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg my-4 ring-1 ring-red-200">
        <span className="text-red-600 font-bold">This order has been cancelled.</span>
      </div>
    );
  }

  return (
    <div className="relative w-full my-8">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
        <div 
            className="absolute top-1/2 left-0 h-0.5 bg-green-500 transform -translate-y-1/2 transition-all duration-500"
            style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
        ></div>
        <div className="relative flex justify-between items-start">
            {statuses.map((s, index) => (
                <div key={s.name} className="flex flex-col items-center text-center w-24 z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${index <= currentStatusIndex ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-300'}`}>
                        {index < currentStatusIndex ? <CheckCircleIcon className="w-7 h-7" /> : s.icon}
                    </div>
                    <p className={`mt-2 text-sm font-semibold transition-colors duration-300 ${index <= currentStatusIndex ? 'text-gray-800' : 'text-gray-400'}`}>{s.name}</p>
                </div>
            ))}
        </div>
    </div>
  );
};

// --- Main MyOrders Component ---
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchUserOrders = async () => {
      try {
        const response = await api.get(`/orders?userId=${currentUser.id}`);
        setOrders(response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      } catch (err) {
        setError('Failed to fetch your orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserOrders();
  }, [currentUser]);

  if (loading) return <div className="text-center p-20 font-semibold text-gray-700">Loading your orders...</div>;
  if (error) return <div className="text-center p-20 text-red-500">{error}</div>;
  if (!currentUser) return <div className="text-center p-20 text-gray-600">Please log in to view your orders.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Order History</h1>
      
        {orders.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-md border">
            <svg className="mx-auto h-16 w-16 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /></svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">No Orders Found</h3>
            <p className="mt-2 text-gray-500">You haven't placed any orders with us yet. Let's change that!</p>
            <button
              onClick={() => navigate('/products')}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Shopping
            </button>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
      </div>
    </div>
  );
};

// --- Reusable Order Card Component for cleaner code ---
const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-6 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-sm text-gray-500">Order Placed</p>
          <p className="font-semibold text-gray-800">{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="font-bold text-lg text-gray-900">₹{order.total.toFixed(2)}</p>
        </div>
        <div className="w-full sm:w-auto">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-mono text-sm text-gray-600 tracking-wider bg-gray-200 px-2 py-1 rounded-md">{order.id}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <OrderTracker status={order.status} />

        {/* Item Previews */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-4">{order.items.length} item(s) in this order:</h4>
          <div className="space-y-4">
            {order.items.slice(0, isExpanded ? order.items.length : 2).map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img 
                  src={item.image || 'https://via.placeholder.com/150'} 
                  alt={item.name} 
                  className="w-16 h-16 rounded-md object-cover border"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          {order.items.length > 2 && (
            <div className="text-center mt-4">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
              >
                {isExpanded ? 'Show Less' : `+ ${order.items.length - 2} more item(s)`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;