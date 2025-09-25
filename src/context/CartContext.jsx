import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  const fetchCartDetails = useCallback(async () => {
    if (!currentUser) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Step 1: Fetch the user's cart data (contains productId and quantity)
      const userResponse = await fetch(`http://localhost:3001/users/${currentUser.id}`);
      if (!userResponse.ok) throw new Error("Could not fetch user data.");
      
      const userData = await userResponse.json();
      const userCartData = userData.cart || [];

      if (userCartData.length === 0) {
        setCart([]);
        setLoading(false);
        return;
      }

      // Step 2: Fetch the full details for each product in the cart
      const productPromises = userCartData.map(item =>
        fetch(`http://localhost:3001/products/${item.productId}`).then(res => res.json())
      );
      
      const productDetails = await Promise.all(productPromises);

      // Step 3: Merge product details with quantities to form the final cart state
      const mergedCart = productDetails.map(product => ({
        ...product,
        quantity: userCartData.find(item => item.productId === product.id)?.quantity || 0,
      }));

      setCart(mergedCart);

    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCartDetails();
  }, [fetchCartDetails]);

  // Generic function to update the cart on the server
  const updateServerCart = async (newCartData) => {
    if (!currentUser) return null;
    try {
      const response = await fetch(`http://localhost:3001/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: newCartData }),
      });
      return response.json();
    } catch (error) {
      console.error("Failed to update cart on server:", error);
      return null;
    }
  };

  const addToCart = async (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(newCart); // Optimistic UI update

    const newCartData = newCart.map(({ id, quantity }) => ({ productId: id, quantity }));
    await updateServerCart(newCartData);
  };

  const decrementCartItem = async (productId) => {
    const existingItem = cart.find((item) => item.id === productId);
    if (!existingItem) return;

    let newCart;
    if (existingItem.quantity === 1) {
      // Remove item if quantity becomes 0
      newCart = cart.filter((item) => item.id !== productId);
    } else {
      newCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    }

    setCart(newCart); // Optimistic UI update

    const newCartData = newCart.map(({ id, quantity }) => ({ productId: id, quantity }));
    await updateServerCart(newCartData);
  };

  const removeFromCart = async (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart); // Optimistic UI update

    const newCartData = newCart.map(({ id, quantity }) => ({ productId: id, quantity }));
    await updateServerCart(newCartData);
  };

  const clearCart = async () => {
    setCart([]); // Optimistic UI update
    await updateServerCart([]);
  };

  const value = {
    cart,
    addToCart,
    decrementCartItem,
    removeFromCart,
    clearCart,
    loading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};