import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // If a user navigates to this page directly without placing an order,
  // redirect them to the homepage.
  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  // While the effect is running or if there's no order, render nothing.
  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-lg w-full">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank you for your order!</h1>
        <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="text-lg font-mono font-semibold text-gray-800">#{order.id}</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/my-orders" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto">
            View My Orders
          </Link>
          <Link to="/products" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors w-full sm:w-auto">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;