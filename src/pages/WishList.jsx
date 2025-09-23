import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id); // optional: remove from wishlist after adding to cart
    navigate("/cart");
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        Your wishlist is empty.
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 text-center mb-10">
        My Wishlist
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="relative bg-white rounded-xl shadow-sm p-6 text-center group hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/products/${item.id}`)}
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={
                  item.images?.[0] ||
                  "https://via.placeholder.com/256x256?text=No+Image"
                }
                alt={item.name || "Product Image"}
                className="w-full h-64 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/256x256?text=No+Image";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center space-x-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                  }}
                  className="bg-gray-900 text-white p-3 rounded-full hover:bg-gray-700 transition"
                  title="Add to Cart"
                >
                  🛒
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(item.id);
                  }}
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-400 transition"
                  title="Remove from Wishlist"
                >
                  ❌
                </button>
              </div>
            </div>

            <p className="text-base font-medium text-gray-700">
              {item.name || "Unnamed Product"}
            </p>

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
    </div>
  );
};

export default WishlistPage;
