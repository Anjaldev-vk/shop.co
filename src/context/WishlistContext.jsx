import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext"; // Make sure the path is correct

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  // Use useCallback to memoize the fetch function
  const fetchWishlistDetails = useCallback(async () => {
    if (!currentUser) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Step 1: Fetch the user's data to get the wishlist of product IDs
      const userResponse = await fetch(`http://localhost:3001/users/${currentUser.id}`);
      if (!userResponse.ok) throw new Error("Could not fetch user data.");
      
      const userData = await userResponse.json();
      const productIds = userData.wishlist || [];

      if (productIds.length === 0) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      // Step 2: Fetch the full details for each product ID
      const productPromises = productIds.map(id =>
        fetch(`http://localhost:3001/products/${id}`).then(res => res.json())
      );
      
      const productDetails = await Promise.all(productPromises);
      setWishlist(productDetails);

    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setWishlist([]); // Clear wishlist on error
    } finally {
      setLoading(false);
    }
  }, [currentUser]); // Dependency on currentUser

  // Fetch the wishlist when the component mounts or the user changes
  useEffect(() => {
    fetchWishlistDetails();
  }, [fetchWishlistDetails]);

  // Function to add a product to the wishlist
  const addToWishlist = async (product) => {
    if (!currentUser) return;
    
    // Check for duplicates in the local state
    if (wishlist.some(item => item.id === product.id)) {
        console.log("Product already in wishlist");
        return;
    }

    try {
        // First, get the current list of IDs from the server
        const userResponse = await fetch(`http://localhost:3001/users/${currentUser.id}`);
        const userData = await userResponse.json();
        const currentWishlistIds = userData.wishlist || [];

        // Create the updated list of IDs
        const updatedWishlistIds = [...currentWishlistIds, product.id];
        
        // Update the server with the new array of IDs
        await fetch(`http://localhost:3001/users/${currentUser.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wishlist: updatedWishlistIds }),
        });

        // Update local state optimistically with the full product object
        setWishlist(prevWishlist => [...prevWishlist, product]);

    } catch (error) {
        console.error("Failed to add product to wishlist:", error);
    }
  };

  // Function to remove a product from the wishlist
  const removeFromWishlist = async (productId) => {
    if (!currentUser) return;

    try {
        // First, get the current list of IDs from the server
        const userResponse = await fetch(`http://localhost:3001/users/${currentUser.id}`);
        const userData = await userResponse.json();
        const currentWishlistIds = userData.wishlist || [];

        // Create the updated list of IDs by filtering
        const updatedWishlistIds = currentWishlistIds.filter(id => id !== productId);

        // Update the server
        await fetch(`http://localhost:3001/users/${currentUser.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wishlist: updatedWishlistIds }),
        });

        // Update local state optimistically
        setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
        
    } catch (error) {
        console.error("Failed to remove product from wishlist:", error);
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