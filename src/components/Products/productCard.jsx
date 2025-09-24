// ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    navigate("/cart");
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (wishlist.find((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = wishlist.find((item) => item.id === product.id);

  return (
    <div
      className="relative bg-white rounded-xl shadow-sm p-6 text-center group hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/256x256?text=No+Image"}
          alt={product.name || "Product Image"}
          className="w-full h-64 object-cover rounded-lg mb-4 transition-all duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/256x256?text=No+Image";
          }}
        />

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center space-x-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="bg-gray-900 text-white p-3 rounded-full hover:bg-gray-700 transition"
            title="Add to Cart"
          >
            🛒
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`p-3 rounded-full transition ${
              isInWishlist ? "bg-red-500 text-white" : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
            title="Toggle Wishlist"
          >
            ❤️
          </button>
        </div>
      </div>

      {/* Product Info */}
      <p className="text-base font-medium text-gray-700">
        {product.name || "Unnamed Product"}
      </p>

      {/* Rating */}
      <div className="flex justify-center text-yellow-400 mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i}>{i < Math.floor(product.rating || 0) ? "★" : "☆"}</span>
        ))}
        <span className="text-gray-600 text-sm ml-1">{product.rating || 0}/5</span>
      </div>

      {/* Price */}
      {product.discountedPrice ? (
        <>
          <p className="text-lg font-semibold line-through text-gray-400">
            ${product.originalPrice ? product.originalPrice.toFixed(2) : "0.00"}
          </p>
          <p className="text-lg font-semibold text-red-500">
            ${product.discountedPrice ? product.discountedPrice.toFixed(2) : "0.00"}{" "}
            <span className="text-sm text-pink-500">{product.discount || ""}</span>
          </p>
        </>
      ) : (
        <p className="text-lg font-semibold text-gray-900">
          ${product.price ? product.price.toFixed(2) : "0.00"}
        </p>
      )}
    </div>
  );
};

export default ProductCard;
