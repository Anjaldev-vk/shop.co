import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

// --- SVG Icon Components for a professional look ---
const HeartIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);
const ShoppingBagIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);
const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.71c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);


// --- Reusable Wishlist Item Component for a cleaner structure ---
const WishlistItem = ({ item, onAddToCart, onRemove, onNavigate }) => {
  const isOutOfStock = !item.count || item.count <= 0;

  // Determine stock status and corresponding styles
  const getStockInfo = () => {
    if (isOutOfStock) {
      return { text: "Out of Stock", className: "text-red-500" };
    }
    if (item.count <= 10) {
      return { text: "Low Stock", className: "text-yellow-600" };
    }
    return { text: "In Stock", className: "text-green-600" };
  };

  const stockInfo = getStockInfo();

  return (
    <div className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-xl shadow-md border border-gray-200 gap-6 transition-shadow hover:shadow-lg">
      <img
        src={item.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image"}
        alt={item.name || "Product Image"}
        className="w-32 h-32 object-cover rounded-lg flex-shrink-0 cursor-pointer"
        onClick={onNavigate}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
        }}
      />

      <div className="flex-1 text-center sm:text-left">
        <p className="text-sm text-gray-500">{item.brand || 'Brand'}</p>
        <h3
          className="text-lg font-bold text-gray-800 cursor-pointer hover:text-indigo-600"
          onClick={onNavigate}
        >
          {item.name || "Unnamed Product"}
        </h3>
        <p className={`text-sm font-semibold mt-1 ${stockInfo.className}`}>
          {stockInfo.text}
        </p>
      </div>

      <div className="flex-shrink-0 text-center sm:text-right">
        <p className="text-xl font-bold text-gray-900 mb-4">
            {item.price ? `₹${item.price.toFixed(2)}` : "₹0.00"}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onRemove}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-red-500 transition-colors"
            title="Remove from Wishlist"
          >
            <TrashIcon className="w-6 h-6" />
          </button>
          <button
            onClick={onAddToCart}
            disabled={isOutOfStock}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            title={isOutOfStock ? "Item is out of stock" : "Add to Cart"}
          >
            <ShoppingBagIcon className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Wishlist Page Component ---
const WishlistPage = () => {
  const { currentUser, loading } = useContext(AuthContext);
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center p-20 font-semibold">Loading your wishlist...</div>;
  }

  if (!currentUser) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };
  
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-gray-50 min-h-[60vh]">
        <HeartIcon className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mt-2 mb-6">Looks like you haven't added anything yet. Let's change that!</p>
        <Link 
          to="/products" 
          className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-transform hover:scale-105"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          My Wishlist
        </h1>
        <div className="space-y-6">
          {wishlist.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              onAddToCart={(e) => {
                e.stopPropagation();
                handleAddToCart(item);
              }}
              onRemove={(e) => {
                e.stopPropagation();
                removeFromWishlist(item.id);
              }}
              onNavigate={() => navigate(`/products/${item.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;