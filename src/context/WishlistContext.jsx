import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import toast from 'react-hot-toast'; 
import { AuthContext } from "./AuthContext";

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
      const userResponse = await fetch(`http://localhost:3001/users/${currentUser.id}`);
      if (!userResponse.ok) throw new Error("Could not fetch user data.");
      
      const userData = await userResponse.json();
      const productIds = userData.wishlist || [];

      if (productIds.length === 0) {
        setWishlist([]);
        return;
      }

      const productPromises = productIds.map(id =>
        fetch(`http://localhost:3001/products/${id}`).then(res => {
          if (!res.ok) console.warn(`Could not fetch product with id: ${id}`);
          return res.json();
        })
      );
      
      const productDetails = await Promise.all(productPromises);
      setWishlist(productDetails.filter(p => p.id)); 

    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
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

    const currentWishlistIds = wishlist.map(item => item.id);
    const updatedWishlistIds = [...currentWishlistIds, product.id];
    
    setWishlist(prevWishlist => [...prevWishlist, product]);
    toast.success(`${product.name} added to wishlist!`);

    try {
      await fetch(`http://localhost:3001/users/${currentUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wishlist: updatedWishlistIds }),
      });
    } catch (error) {
      console.error("Failed to add product to wishlist:", error);
      toast.error("Could not add item. Please try again.");
      setWishlist(prev => prev.filter(item => item.id !== product.id));
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!currentUser) return;

    const productName = wishlist.find(item => item.id === productId)?.name || 'Item';

    const updatedWishlistIds = wishlist
      .filter(item => item.id !== productId)
      .map(item => item.id);

    setWishlist(prev => prev.filter(item => item.id !== productId));
    toast.error(`${productName} removed from wishlist.`);

    try {
      await fetch(`http://localhost:3001/users/${currentUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wishlist: updatedWishlistIds }),
      });
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