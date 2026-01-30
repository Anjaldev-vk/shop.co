import React from "react";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatPrice } from "../../utils/formatPrice";
import StarRating from "../../components/StarRating";

const HeartIcon = ({ isInWishlist, ...props }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const ShoppingBagIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);


const ProductCard = ({ product }) => {
  if (!product || !product.id) {
    return null; 
  }

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (wishlist.some((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleNavigate = () => {
    if (product && product.slug) {
      navigate(`/products/${product.slug}`);
    } else {
      console.error("Attempted to navigate with an invalid product slug.");
    }
  };

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  // Fallbacks for missing backend data
  const imageUrl = product.image || "https://via.placeholder.com/300x300?text=No+Image";
  const rating = product.rating || 4.5; // Default rating since backend doesn't have it
  const reviewCount = product.reviews_count || 0;
  const brand = product.brand || 'Shop.co'; 

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-black/5"
      onClick={handleNavigate}
    >
      <div className="relative aspect-w-4 aspect-h-5 w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name || "Product Image"}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
          }}
        />
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#000", color: "#fff" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWishlist}
            className={`p-2.5 rounded-full shadow-lg transition-colors duration-200 ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-900'}`}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <HeartIcon isInWishlist={isInWishlist} className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#000", color: "#fff" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="p-2.5 rounded-full bg-white text-gray-900 shadow-lg transition-colors duration-200"
            title="Add to Cart"
          >
            <ShoppingBagIcon className="w-5 h-5" />
          </motion.button>
        </div>
        
        {/* Discount Badge if applicable */}
        {product.discount_price && product.price > product.discount_price && (
           <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
             -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
           </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1 opacity-70 group-hover:opacity-100 transition-opacity">{product.category || brand}</p>
        <h3 className="text-lg font-bold text-gray-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">
          {product.name || "Unnamed Product"}
        </h3>
        
        <div className="flex items-center text-sm mb-3">
          <StarRating rating={rating} size="text-xs" />
          <span className="ml-2 text-xs text-gray-400 font-medium">({reviewCount} reviews)</span>
        </div>

        <div className="flex flex-1 items-end justify-between pt-2 border-t border-gray-50 mt-auto">
          {product.discount_price && product.price > product.discount_price ? (
            <div className="flex flex-col">
              <p className="text-lg font-extrabold text-black">
                {formatPrice(product.final_price || product.discount_price)}
              </p>
              <p className="text-xs font-medium text-gray-400 line-through">
                {formatPrice(product.price)}
              </p>
            </div>
          ) : (
            <p className="text-lg font-extrabold text-black">
              {formatPrice(product.price)}
            </p>
          )}
          
          <button 
             onClick={handleAddToCart}
             className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition-colors opacity-0 group-hover:opacity-100"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
