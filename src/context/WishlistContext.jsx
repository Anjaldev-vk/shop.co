import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

// Create context
const WishlistContext = createContext();

// Provider component
export const WishlistProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext); // Get logged-in user
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  // Persist wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add item to wishlist
  const addToWishlist = (product) => {
    if (!currentUser) {
      alert("You need to log in first!");
      return;
    }
    setWishlist((prev) =>
      prev.find((item) => item.id === product.id) ? prev : [...prev, product]
    );
  };

  // Remove item from wishlist
  const removeFromWishlist = (id) => {
    if (!currentUser) {
      alert("You need to log in first!");
      return;
    }
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all wishlist items
  const clearWishlist = () => {
    if (!currentUser) {
      alert("You need to log in first!");
      return;
    }
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook for easier usage
export const useWishlist = () => useContext(WishlistContext);
