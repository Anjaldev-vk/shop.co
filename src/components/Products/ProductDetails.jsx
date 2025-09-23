import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Failed to fetch product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  const handleAddToWishlist = () => {
    if (!wishlistAdded) {
      addToWishlist(product);
      setWishlistAdded(true);
      showToast(`${product.name} added to wishlist!`);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-600">
        Loading product details...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 font-semibold">
        {error}
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 font-semibold">
        Product not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10 px-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 bg-white text-gray-900 px-6 py-3 rounded-xl shadow-lg z-50 border animate-slide-in-out">
          ✅ {toastMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl flex flex-col md:flex-row gap-8 border border-gray-200">
        {/* Product Image */}
        <div className="md:w-1/2 flex items-center justify-center">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image"}
            alt={product.name}
            className="w-full h-96 object-contain rounded-xl bg-gray-100 p-4"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-gray-500 text-lg mb-4 font-medium">{product.brand}</p>
            )}

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    {i < Math.floor(product.rating) ? "★" : "☆"}
                  </span>
                ))}
                <span className="ml-3 text-gray-600 text-sm font-medium">
                  {product.rating}/5
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center mb-6 gap-4">
              {product.discountedPrice ? (
                <>
                  <span className="text-3xl font-bold text-indigo-600">
                    ${product.discountedPrice.toFixed(2)}
                  </span>
                  <span className="line-through text-gray-400 text-lg">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-md"
            >
              Buy Now
            </button>

            <button
              onClick={handleAddToWishlist}
              className={`flex-1 ${
                wishlistAdded ? "bg-pink-500" : "bg-gray-800"
              } text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md`}
            >
              {wishlistAdded ? "Added ❤️" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Animation */}
      <style>
        {`
          @keyframes slide-in-out {
            0% { transform: translateX(100%); opacity: 0; }
            10% { transform: translateX(0); opacity: 1; }
            90% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          .animate-slide-in-out {
            animation: slide-in-out 3s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default ProductDetails;
