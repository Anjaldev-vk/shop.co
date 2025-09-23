import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const { currentUser, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if the user is not an admin
  if (!currentUser || !isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome, {currentUser.username}! Here you can manage products, users, and orders.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer">
              <h3 className="font-bold text-indigo-600">Add New Product</h3>
              <p className="text-sm text-gray-500">Create a new product listing.</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer">
              <h3 className="font-bold text-indigo-600">Edit Products</h3>
              <p className="text-sm text-gray-500">Modify existing product details.</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer">
              <h3 className="font-bold text-indigo-600">Archive Products</h3>
              <p className="text-sm text-gray-500">Soft delete or archive products.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;