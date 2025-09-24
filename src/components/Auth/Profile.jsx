import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  // Fetch only current user's orders
  const orders = currentUser
    ? JSON.parse(localStorage.getItem(`orders_${currentUser.username}`)) || []
    : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-700">You are not logged in.</p>
        <Link to="/login" className="text-indigo-600">Login</Link> |{" "}
        <Link to="/signup" className="text-indigo-600">Signup</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>

      <div className="mb-4">
        <p className="mb-1"><strong>Username:</strong> {currentUser.username}</p>
        <p className="mb-1"><strong>Email:</strong> {currentUser.email}</p>
        <p className="mb-1"><strong>Role:</strong> {currentUser.role}</p>
      </div>

      <div className="mb-4">
        <p className="mb-1"><strong>Cart Items:</strong> {cart.reduce((acc, item) => acc + item.quantity, 0)}</p>
        <p className="mb-1"><strong>Wishlist Items:</strong> {wishlist.length}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Previous Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No previous orders</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700">
            {orders.map((order, index) => (
              <li key={index}>
                Order #{order.id} - {order.items.length} items - Total: ${order.total.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
