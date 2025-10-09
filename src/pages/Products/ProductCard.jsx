import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

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
    if (product && product.id) {
      navigate(`/products/${product.id}`);
    } else {
      console.error("Attempted to navigate with an invalid product ID.");
    }
  };

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={product.name || "Product Image"}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
          }}
        />
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full transition-colors duration-200 ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white/70 text-gray-700 hover:bg-white'}`}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <HeartIcon isInWishlist={isInWishlist} className="w-6 h-6" />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-white/70 text-gray-700 hover:bg-white transition-colors duration-200"
            title="Add to Cart"
          >
            <ShoppingBagIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-2 p-4">
        <p className="text-sm text-gray-500">{product.brand || 'Brand'}</p>
        <h3 className="text-base font-semibold text-gray-900 truncate">
          {product.name || "Unnamed Product"}
        </h3>
        
        <div className="flex items-center text-sm">
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(product.rating || 0) ? "★" : "☆"}</span>
            ))}
          </div>
          <span className="ml-2 text-gray-500">({product.rating || 0})</span>
        </div>

        <div className="flex flex-1 flex-col justify-end pt-2">
          {product.discountedPrice && product.price > product.discountedPrice ? (
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-gray-900">
                ₹{product.discountedPrice.toFixed(2)}
              </p>
              <p className="text-sm font-medium text-gray-500 line-through">
                ₹{product.price.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold text-gray-900">
              ₹{(product.price || 0).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
