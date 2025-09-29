import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext); // Get the currently logged-in user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users');
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

  // --- Handler to Block/Unblock a user ---
  const handleToggleBlock = async (userId, isCurrentlyBlocked) => {
    const action = isCurrentlyBlocked ? 'unblock' : 'block';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        // Use PATCH to update only the isBlock field
        await axios.patch(`http://localhost:3001/users/${userId}`, {
          isBlock: !isCurrentlyBlocked,
        });
        // Update the state locally to show the change immediately
        setUsers(users.map(u => 
          u.id === userId ? { ...u, isBlock: !isCurrentlyBlocked } : u
        ));
        alert(`User has been ${action}ed successfully!`);
      } catch (err) {
        alert(`Failed to ${action} user.`);
        console.error(err);
      }
    }
  };

  // --- Handler to Delete a user ---
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:3001/users/${userId}`);
        // Remove the user from the state locally
        setUsers(users.filter(u => u.id !== userId));
        alert('User deleted successfully!');
      } catch (err) {
        alert('Failed to delete user.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center p-10">Loading users...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Manage Users 👥</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 font-semibold">Username</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Role</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{user.username}</td>
                <td className="p-3">{user.email || 'N/A'}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.isBlock ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {/* Prevent admin from taking action on their own account */}
                  {currentUser && currentUser.id === user.id ? (
                    <span className="text-gray-400 font-medium">Your Account</span>
                  ) : (
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => handleToggleBlock(user.id, user.isBlock)} 
                        className={`font-medium ${
                          user.isBlock 
                          ? 'text-green-600 hover:underline' 
                          : 'text-yellow-600 hover:underline'
                        }`}
                      >
                        {user.isBlock ? 'Unblock' : 'Block'}
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)} 
                        className="text-red-600 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;