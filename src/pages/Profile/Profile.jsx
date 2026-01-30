import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

// --- Icon Components ---
const DashboardIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const OrdersIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const LogoutIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

// --- Helper component for the stats bar ---
const StatCard = ({ label, value, icon }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4">
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);


// --- Main Profile Component ---
const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const { cartItemCount } = useCart();
  const { wishlist } = useWishlist();
  const [orderedItemsCount, setOrderedItemsCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchOrderStats = async () => {
      setIsLoadingStats(true);
      try {
        const response = await api.get(`api/orders?userId=${currentUser.id}`);
        const totalItems = response.data.reduce((total, order) => 
            total + order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0), 0);
        setOrderedItemsCount(totalItems);
      } catch (error) {
        console.error("Failed to fetch order stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchOrderStats();
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center p-10 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-6">Log in to manage your account and view your orders.</p>
            <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
                Go to Login
            </button>
        </div>
      </div>
    );
  }

  const navLinkClasses = "flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors";
  const activeLinkClasses = "bg-indigo-100 text-indigo-700";
  const inactiveLinkClasses = "text-gray-600 hover:bg-gray-100";

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">

                {/* --- Sidebar --- */}
                <aside className="md:w-1/4">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col h-full">
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center text-4xl font-bold text-indigo-700 mb-2">
                                {currentUser.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{currentUser.name}</h2>
                            <p className="text-sm text-gray-500">{currentUser.email}</p>
                        </div>

                        <nav className="flex flex-col space-y-2">
                            <NavLink to="/profile" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`} end>
                                <DashboardIcon className="w-5 h-5"/> Account Overview
                            </NavLink>
                            <NavLink to="/my-orders" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                                <OrdersIcon className="w-5 h-5"/> My Orders
                            </NavLink>
                        </nav>
                        
                        <button
                            onClick={handleLogout}
                            className={`${navLinkClasses} ${inactiveLinkClasses} mt-auto`}
                        >
                            <LogoutIcon className="w-5 h-5"/> Logout
                        </button>
                    </div>
                </aside>

                {/* --- Main Content --- */}
                <main className="flex-1">
                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Overview</h1>
                        <p className="text-gray-600 mb-8">
                            Welcome back, {currentUser.name}! Here's a summary of your account activity.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard label="In Your Cart" value={cartItemCount} icon={<DashboardIcon className="w-6 h-6"/>} />
                            <StatCard label="In Wishlist" value={wishlist.length} icon={<DashboardIcon className="w-6 h-6"/>} />
                            <StatCard label="Items Ordered" value={isLoadingStats ? "..." : orderedItemsCount} icon={<OrdersIcon className="w-6 h-6"/>} />
                        </div>
                    </div>
                </main>

            </div>
        </div>
    </div>
  );
};

export default Profile;