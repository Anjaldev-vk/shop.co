import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import api from "../../api/axiosConfig";
import PageTransition from "../../components/PageTransition";
import { LoadingSpinner } from "../../components/Loading";
import { formatPrice } from "../../utils/formatPrice";
import StarRating from "../../components/StarRating";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  // 1. Add state to manage the selected size
  const [selectedSize, setSelectedSize] = useState(null);

  const isInWishlist = product
    ? wishlist.some((item) => item.id === product.id)
    : false;

  const isOutOfStock = product && product.count <= 0;

  useEffect(() => {
    if (!id) {
      setError("No product ID provided.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        // 2. Set the first available size as the default selected size
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
        setError(null);
      } catch (err) {
        setError("Failed to fetch product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    // 3. Pass the selected size along with the product info
    addToCart({ ...product, selectedSize }, quantity);
  };

  const handleBuyNow = () => {
    if (!product || isOutOfStock) return;
    // Navigate to checkout with only this item as buy-now payload (do not add to cart)
    const buyNowItem = { ...product, selectedSize, quantity };
    navigate("/checkout", { state: { buyNowItems: [buyNowItem] } });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center min-h-screen">Product not found.</div>;
  }


  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="w-full h-[450px] bg-gray-50 rounded-xl flex items-center justify-center p-4">
              <img
                src={product.images?.[0] || "https://via.placeholder.com/500x500?text=No+Image"}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-indigo-600 font-semibold mb-2">{product.brand || 'N/A'}</p>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
                
                {product.rating && (
                  <div className="flex items-center mb-5">
                    <StarRating rating={product.rating} size="text-2xl" />
                    <span className="ml-3 text-gray-600 font-medium">{product.rating}/5</span>
                  </div>
                )}
                
                <p className="text-4xl font-bold text-gray-900 mb-6">
                  {formatPrice(product.price)}
                </p>
                
                <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                
                {/* 4. UI Section for Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <p className="font-semibold text-gray-800 mb-3 text-lg">Select Size:</p>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-5 py-2 border rounded-lg font-medium transition-colors duration-200 ${
                            selectedSize === size
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Information */}
                <div className="mb-6">
                  {isOutOfStock ? (
                    <p className="font-semibold text-red-500 text-lg"> Out of Stock</p>
                  ) : (
                    <p className="font-semibold text-green-600">
                      Only {product.count} left in stock!
                    </p>
                  )}
                </div>
              </div>
              
              {/* Actions Section */}
              <div className="mt-6">
                <div className="flex items-center gap-4 mb-6">
                  <label className="font-semibold">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-lg">-</button>
                    <span className="px-4 py-2 font-bold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(prev => Math.min(prev + 1, product.count))}
                      disabled={quantity >= product.count || isOutOfStock}
                      className="px-4 py-2 text-lg disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                  </button>
                  
                  <button
                    onClick={handleToggleWishlist}
                    disabled={!product}
                    className={`w-full sm:w-14 h-14 flex items-center justify-center rounded-xl transition ${isInWishlist ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"} disabled:bg-gray-200 disabled:cursor-not-allowed`}
                    title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );

};

export default ProductDetails;