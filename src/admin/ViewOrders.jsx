import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Tracks which order is expanded

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
      } catch (err) {
        setError('Failed to fetch orders.');
        console.error(err);
      } finally {
        setLoading(false);
      } 
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const originalOrders = [...orders];
    const updatedOrders = orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders); // Optimistic update

    try {
      // Use PATCH to update only the status field
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      toast.success('Order status updated!');
    } catch (err) {
      toast.error('Failed to update status.');
      console.error(err);
      // Revert to the original state if the API call fails
      setOrders(originalOrders);
    }
  };

  // --- Handler to toggle the expanded view of order items ---
  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) return <div className="text-center p-10">Loading orders...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">View Orders </h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 font-semibold">Order ID</th>
              <th className="p-3 font-semibold">Customer</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Total</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <React.Fragment key={order.id}>
                {/* Main Order Row */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{order.id}</td>
                  <td className="p-3 font-medium">{order.customerInfo.name}</td>
                  <td className="p-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="p-3">₹{order.total.toFixed(2)}</td>
                  <td className="p-3">
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => toggleExpandOrder(order.id)}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      {expandedOrderId === order.id ? 'Hide Items' : 'View Items'}
                    </button>
                  </td>
                </tr>

                {/* Expanded Row for Order Items */}
                {expandedOrderId === order.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="p-4">
                      <div className="p-4 bg-white rounded-md border">
                        <h4 className="font-bold text-md mb-2">Order Items:</h4>
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b">
                              <th className="p-2 font-semibold">Product</th>
                              <th className="p-2 font-semibold">Quantity</th>
                              <th className="p-2 font-semibold">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map(item => (
                              <tr key={item.id}>
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{item.quantity}</td>
                                <td className="p-2">₹{item.price.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewOrders;