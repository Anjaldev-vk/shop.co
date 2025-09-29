import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
import toast from 'react-hot-toast'; // ✅ Import toast for notifications
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
      const userResponse = await fetch(`http://localhost:3001/users/${currentUser.id}`);
      if (!userResponse.ok) throw new Error("Could not fetch user data.");
      
      const userData = await userResponse.json();
      const userCartData = userData.cart || [];

      if (userCartData.length === 0) {
        setCart([]);
        return;
      }

      const productPromises = userCartData.map(item =>
        fetch(`http://localhost:3001/products/${item.productId}`).then(res => res.json())
      );
      
      const productDetails = await Promise.all(productPromises);

      const mergedCart = productDetails.map(product => ({
        ...product,
        quantity: userCartData.find(item => item.productId === String(product.id))?.quantity || 0,
      })).filter(item => item.quantity > 0); // Ensure no items with 0 quantity are added

      setCart(mergedCart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      toast.error("Could not load your cart."); // ✅ Notify user on fetch failure
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCartDetails();
  }, [fetchCartDetails]);

  const updateServerCart = async (newCartData) => {
    if (!currentUser) return null;
    try {
      const response = await fetch(`http://localhost:3001/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: newCartData }),
      });
      if (!response.ok) throw new Error("Server update failed.");
      return response.json();
    } catch (error) {
      console.error("Failed to update cart on server:", error);
      return null;
    }
  };
  
  const formatCartForServer = (cartState) => cartState.map(({ id, quantity }) => ({ productId: String(id), quantity }));

  const addToCart = async (product, quantityToAdd = 1) => {
    if (!currentUser) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    const originalCart = [...cart];
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: quantityToAdd }];
    }
    
    setCart(newCart);
    toast.success(`${quantityToAdd} x ${product.name} added to cart!`); // ✅ Notify user

    const serverResult = await updateServerCart(formatCartForServer(newCart));
    if (!serverResult) {
      setCart(originalCart);
      toast.error("Failed to update cart. Please try again."); // ✅ Notify user on failure
    }
  };

  const decrementCartItem = async (productId) => {
    const originalCart = [...cart];
    const existingItem = cart.find((item) => item.id === productId);
    if (!existingItem) return;

    const newCart =
      existingItem.quantity === 1
        ? cart.filter((item) => item.id !== productId)
        : cart.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          );

    setCart(newCart);
    // No toast here as UI changes are immediate and clear

    const serverResult = await updateServerCart(formatCartForServer(newCart));
    if (!serverResult) {
      setCart(originalCart);
      toast.error("Failed to update item quantity."); // ✅ Notify user on failure
    }
  };

  const removeFromCart = async (productId) => {
    const productName = cart.find(item => item.id === productId)?.name || 'Item';
    const originalCart = [...cart];
    const newCart = cart.filter((item) => item.id !== productId);
    
    setCart(newCart);
    toast.error(`${productName} removed from cart.`); // ✅ Notify user

    const serverResult = await updateServerCart(formatCartForServer(newCart));
    if (!serverResult) {
      setCart(originalCart);
      toast.error("Failed to remove item. Please try again."); // ✅ Notify user on failure
    }
  };

  const clearCart = async () => {
    const originalCart = [...cart];
    setCart([]);
    toast.success("Cart has been cleared."); // ✅ Notify user
    
    const serverResult = await updateServerCart([]);
    if (!serverResult) {
      setCart(originalCart);
      toast.error("Could not clear cart. Please try again."); // ✅ Notify user on failure
    }
  };

  const cartItemCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.discountedPrice || item.price || 0) * item.quantity, 0), [cart]);

  const value = { cart, addToCart, decrementCartItem, removeFromCart, clearCart, loading, cartItemCount, cartTotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};