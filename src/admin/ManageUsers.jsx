import React, { useState, useEffect, useContext, useMemo } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

// --- UserDetailsModal Component (No changes needed here) ---
const UserDetailsModal = ({ user, orders, isLoading, onClose }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
                User Details: <span className="text-indigo-600">{user.username}</span>
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
        
        <div className="p-6 space-y-6">
            {/* User Info Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Account Information</h3>
                <div className="text-sm bg-gray-50 p-4 rounded-lg">
                    <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                    <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
                    <p><strong>Status:</strong> {user.isBlock ? 'Blocked' : 'Active'}</p>
                </div>
            </div>

            {/* Order History Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Order History</h3>
                {isLoading ? (
                    <div className="text-center p-4">Loading orders...</div>
                ) : orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-gray-50 p-4 rounded-lg border">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-bold text-gray-800">Order #{order.id}</p>
                                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{order.status}</span>
                                </div>
                                <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600"><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
                                <details className="mt-2 text-sm">
                                    <summary className="cursor-pointer font-medium text-indigo-600">View Items ({order.items.length})</summary>
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                        {order.items.map(item => (
                                            <li key={item.id}>{item.name} (x{item.quantity})</li>
                                        ))}
                                    </ul>
                                </details>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">This user has no orders.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};


const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users; 
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return users.filter(user => 
        user.username.toLowerCase().includes(lowercasedTerm) ||
        (user.email && user.email.toLowerCase().includes(lowercasedTerm))
    );
  }, [users, searchTerm]);


  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setIsModalLoading(true);
    try {
      const response = await api.get(`/orders?userId=${user.id}`);
      setUserOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
      toast.error("Could not load user orders.");
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleToggleBlock = async (userId, isCurrentlyBlocked) => {
    const action = isCurrentlyBlocked ? 'unblock' : 'block';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await api.patch(`/users/${userId}`, { isBlock: !isCurrentlyBlocked });
        setUsers(users.map(u => u.id === userId ? { ...u, isBlock: !isCurrentlyBlocked } : u));
        toast.success(`User has been ${action}ed successfully!`);
      } catch (err) {
        toast.error(`Failed to ${action} user.`);
        console.error(err);
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
        toast.success('User deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete user.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center p-10">Loading users...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Manage Users </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg py-2 pl-10 pr-4 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 font-semibold">Username</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Role</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Details</th>
              <th className="p-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{user.username}</td>
                  <td className="p-3">{user.email || 'N/A'}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {user.isBlock ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3">
                      <button onClick={() => handleViewDetails(user)} className="text-indigo-600 hover:underline font-medium text-sm">
                          View
                      </button>
                  </td>
                  <td className="p-3 text-center">
                    {currentUser && currentUser.id === user.id ? (
                      <span className="text-gray-400 font-medium">Your Account</span>
                    ) : (
                      <div className="flex justify-center gap-4 text-sm">
                        <button onClick={() => handleToggleBlock(user.id, user.isBlock)} className={`font-medium ${user.isBlock ? 'text-green-600 hover:underline' : 'text-yellow-600 hover:underline'}`}>
                          {user.isBlock ? 'Unblock' : 'Block'}
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline font-medium">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan="6" className="text-center p-10 text-gray-500">
                        No users found matching your search.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          orders={userOrders}
          isLoading={isModalLoading}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default ManageUsers;