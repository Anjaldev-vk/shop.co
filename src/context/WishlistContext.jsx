import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import toast from 'react-hot-toast'; 
import { AuthContext } from "./AuthContext";
import api from "../api/axiosConfig";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  const fetchWishlistDetails = useCallback(async () => {
    if (!currentUser) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/api/wishlist/');
      const data = response.data;
      
      if (data && Array.isArray(data.items)) {
          // Fetch full product details for each wishlist item
          const fullItemsPromises = data.items.map(async (item) => {
              try {
                  const productRes = await api.get(`/api/products/${item.product_id}/`); // item.product_id from serializer
                  const productData = productRes.data;
                  // Merge product data with wishlist item data
                  return {
                      ...productData, // Contains stock_quantity, category, slug, etc.
                      id: item.product_id, // UI uses product ID
                      wishlistItemId: item.id, // For removal
                      added_at: item.added_at,
                      // Ensure properties match UI expectations
                      image: productData.image, 
                      price: productData.final_price || productData.price,
                      stock_quantity: productData.stock_quantity
                  };
              } catch (err) {
                  console.warn("Failed to fetch product details for wishlist item", item);
                  // Fallback to basic info if product fetch fails
                  return {
                      id: item.product_id,
                      wishlistItemId: item.id,
                      name: item.product_name,
                      price: item.product_price,
                      image: item.product_image,
                      added_at: item.added_at,
                      stock_quantity: 0 // Assume 0 if fail
                  };
              }
          });

          const fullItems = await Promise.all(fullItemsPromises);
          setWishlist(fullItems);
      } else {
          setWishlist([]);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      if (error.response?.status !== 404) {
         // toast.error("Could not load wishlist.");
      }
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchWishlistDetails();
  }, [fetchWishlistDetails]);

  const addToWishlist = async (product) => {
    if (!currentUser) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }
    
    if (wishlist.some(item => item.id === product.id)) return;

    try {
        // Backend: POST /wishlist/add/ { product_id }
        // Optimistic
        const tempId = 'temp-' + Date.now();
        setWishlist(prev => [...prev, { ...product, wishlistItemId: tempId }]);
        toast.success(`${product.name} added to wishlist!`);

        await api.post('/api/wishlist/add/', { product_id: product.id });
        
        fetchWishlistDetails(); // Refresh to get real IDs

    } catch (error) {
        console.error("Failed to add product to wishlist:", error);
        toast.error("Could not add item. Please try again.");
        fetchWishlistDetails();
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!currentUser) return;

    const itemToRemove = wishlist.find(item => item.id === productId);
    if (!itemToRemove) return;

    const productName = itemToRemove.name || 'Item';

    try {
        // Optimistic
        setWishlist(prev => prev.filter(item => item.id !== productId));
        toast.error(`${productName} removed from wishlist.`);

        // Backend: POST /wishlist/remove/ { item_id }
        // We need the wishlistItemId, which comes from the API response
        if (itemToRemove.wishlistItemId) {
             await api.post('/api/wishlist/remove/', { item_id: itemToRemove.wishlistItemId });
        } else {
             // If we don't have it (weird case), refresh
             fetchWishlistDetails();
        }
    } catch (error) {
        console.error("Failed to remove product from wishlist:", error);
        toast.error("Could not remove item. Please try again.");
        fetchWishlistDetails();
    }
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    loading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};