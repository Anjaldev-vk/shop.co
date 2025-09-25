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

  // Inline SVG components for icons
  const UserIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  const EnvelopeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

  const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const ShoppingCartIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );

  const HeartIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  const ClipboardDocumentListIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const ArrowRightOnRectangleIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-2a4 4 0 00-4-4H2a4 4 0 00-4 4v2" />
    </svg>
  );

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
          <p className="text-gray-700 text-lg mb-3">You are not logged in.</p>
          <div className="flex justify-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center px-5 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition duration-300"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center py-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-6">
        {/* Profile Header */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {currentUser.username}'s Profile
        </h2>

        {/* Profile Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <UserIcon className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-base font-semibold text-gray-800">{currentUser.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <EnvelopeIcon className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-semibold text-gray-800">{currentUser.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <CheckIcon className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-base font-semibold text-gray-800">{currentUser.role}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
            <ShoppingCartIcon className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Cart Items</p>
              <p className="text-base font-semibold text-gray-800">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
            <HeartIcon className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Wishlist Items</p>
              <p className="text-base font-semibold text-gray-800">{wishlist.length}</p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-5 h-5 text-indigo-600" />
            Previous Orders
          </h3>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center text-sm">No previous orders</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleString()}
                    </p>
                  </div>

                  {/* Order Items */}
                  <ul className="space-y-2">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {/* Small Product Image */}
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                            No Img
                          </div>
                        )}

                        {/* Product Details */}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>

                        {/* Price */}
                        <p className="font-semibold text-indigo-600">
                          $
                          {(
                            (item.discountedPrice ?? item.price ?? 0) *
                            (item.quantity || 1)
                          ).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {/* Order Total */}
                  <div className="mt-3 text-right font-bold text-gray-800">
                    Total: ${order.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
