import React, { useContext, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

const AdminLayout = () => {
  const { logout, isAdmin, loading, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    
    if (!loading) {
      if (!currentUser || !isAdmin) {
        navigate('/', { replace: true });
      }
    }
  }, [loading, isAdmin, currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

 
  if (loading || !isAdmin) {
    return null; 
  }

 
  return (
    <div className="flex">
      <aside className="w-64 bg-white text-black flex flex-col p-4 h-screen sticky top-0 shadow-md">
        <h2 className="text-2xl font-bold mb-6">SHOP.CO Admin</h2>
        <nav className="flex flex-col gap-2">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "bg-gray-200 p-2 rounded" : "p-2 rounded hover:bg-gray-100"}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? "bg-gray-200 p-2 rounded" : "p-2 rounded hover:bg-gray-100"}>Manage Products</NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "bg-gray-200 p-2 rounded" : "p-2 rounded hover:bg-gray-100"}>Manage Users</NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "bg-gray-200 p-2 rounded" : "p-2 rounded hover:bg-gray-100"}>View Orders</NavLink>
        </nav>

        <div className="mt-auto">
          <button 
            onClick={handleLogout} 
            className="w-full text-left p-2 rounded hover:bg-red-500 hover:bg-opacity-80 flex items-center gap-3 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 p-8 h-screen overflow-y-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;