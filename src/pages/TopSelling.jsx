import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useTopSelling from "../context/useTopselling";
import { useWishlist } from "../context/WishlistContext"; 

const TopSelling = () => {
  const { topSelling, loading, error } = useTopSelling();
  const [showAll, setShowAll] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist(); 
  const navigate = useNavigate();

  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // prevent navigation
    addToCart(product);
    navigate("/cart");
  };

  const handleAddToWishlist = (product, e) => {
    e.stopPropagation(); // prevent navigation
    addToWishlist(product);
  };

  const displayedProducts = showAll ? topSelling : topSelling.slice(0, 4);

  return (
    <div className="bg-cream-100 py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 text-center mb-10 animate-slide-up">
        Top Selling
      </h2>

      {loading ? (
        <div className="text-center text-gray-700">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">
          {error.message || "Failed to fetch products. Please try again later."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {displayedProducts.map((item) => (
            <div
              key={item.id}
              className="relative bg-white rounded-xl shadow-sm p-6 text-center group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/products/${item.id}`)}
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={item.images?.[0] || "https://via.placeholder.com/256x256?text=No+Image"}
                  alt={item.name || "Product Image"}
                  className="w-full h-64 object-cover rounded-lg mb-4 transition-all duration-300"

                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/256x256?text=No+Image";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center space-x-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => handleAddToCart(item, e)}
                    className="bg-gray-900 text-white p-3 rounded-full hover:bg-gray-700 transition"
                    title="Add to Cart"
                  >
                    🛒
                  </button>
                  <button
                    onClick={(e) => handleAddToWishlist(item, e)}
                    className="bg-gray-900 text-white p-3 rounded-full hover:bg-gray-700 transition"
                    title="Add to Wishlist"
                  >
                    ❤️
                  </button>
                </div>
              </div>

              <p className="text-base font-medium text-gray-700">
                {item.name || "Unnamed Product"}
              </p>

              <div className="flex justify-center text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(item.rating || 0) ? "★" : "☆"}</span>
                ))}
                <span className="text-gray-600 text-sm ml-1">{item.rating || 0}/5</span>
              </div>

              {item.discountedPrice ? (
                <>
                  <p className="text-lg font-semibold line-through text-gray-400">
                    ${item.originalPrice ? item.originalPrice.toFixed(2) : "0.00"}
                  </p>
                  <p className="text-lg font-semibold text-red-500">
                    ${item.discountedPrice ? item.discountedPrice.toFixed(2) : "0.00"}{" "}
                    <span className="text-sm text-pink-500">{item.discount || ""}</span>
                  </p>
                </>
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  ${item.price ? item.price.toFixed(2) : "0.00"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-gray-900 text-white px-8 py-3 rounded-md font-medium text-base hover:bg-gray-700 transition-all duration-300"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TopSelling;
