import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
import toast from 'react-hot-toast';
import { AuthContext } from "./AuthContext";
import api from "../api/axiosConfig";

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
      const { data: userData } = await api.get(`/users/${currentUser.id}`);
      const userCartData = userData?.cart || [];

      if (userCartData.length === 0) {
        setCart([]);
        return;
      }

      const productPromises = userCartData.map(item => 
        api.get(`/products/${item.productId}`).then(res => res.data)
      );

      const productDetails = await Promise.all(productPromises);

      const mergedCart = productDetails.map(product => ({
        ...product,
        quantity: userCartData.find(item => item.productId === String(product.id))?.quantity || 0,
      })).filter(item => item.quantity > 0);

      setCart(mergedCart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      toast.error("Could not load your cart.");
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
      const { data } = await api.patch(`/users/${currentUser.id}`, { cart: newCartData });
      return data;
    } catch (error) {
      console.error("Failed to update cart on server:", error);
      return null;
    }
  };
  
  const formatCartForServer = (cartState) =>
    cartState.map(({ id, quantity }) => ({ productId: String(id), quantity }));

  // Use functional state update to avoid duplicates on rapid clicks and enforce stock using `count`
  const addToCart = async (product, quantityToAdd = 1) => {
    if (!currentUser) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    let originalCartSnapshot = cart;
    let updatedCart;

    setCart((prev) => {
      originalCartSnapshot = prev;
      const maxStock = Number.isFinite(product?.count) ? product.count : Infinity;
      const idx = prev.findIndex((item) => item.id === product.id);

      if (idx !== -1) {
        const target = prev[idx];
        const newQuantity = target.quantity + quantityToAdd;
        if (newQuantity > maxStock) {
          toast.error(`Only ${maxStock} items available in stock.`);
          updatedCart = prev; // no change
          return prev;
        }
        updatedCart = prev.map((item, i) => (i === idx ? { ...item, quantity: newQuantity } : item));
        return updatedCart;
      }

      if (quantityToAdd > maxStock) {
        toast.error(`Only ${maxStock} items available in stock.`);
        updatedCart = prev; // no change
        return prev;
      }

      updatedCart = [...prev, { ...product, quantity: quantityToAdd }];
      return updatedCart;
    });

    // If no change was applied (due to stock limit), don't proceed
    if (updatedCart === originalCartSnapshot) return;

    toast.success(`${quantityToAdd} x ${product.name} added to cart!`);

    const serverResult = await updateServerCart(formatCartForServer(updatedCart));
    if (!serverResult) {
      setCart(originalCartSnapshot);
      toast.error("Failed to update cart. Please try again.");
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

    const serverResult = await updateServerCart(formatCartForServer(newCart));
    if (!serverResult) {
      setCart(originalCart);
      toast.error("Failed to update item quantity.");
    }
  };

  const removeFromCart = async (productId) => {
    const productName = cart.find(item => item.id === productId)?.name || 'Item';
    const originalCart = [...cart];
    const newCart = cart.filter((item) => item.id !== productId);
    
    setCart(newCart);
    toast.error(`${productName} removed from cart.`);

    const serverResult = await updateServerCart(formatCartForServer(newCart));
    if (!serverResult) {
      setCart(originalCart);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const clearCart = async () => {
    const originalCart = [...cart];
    setCart([]);
    toast.success("Cart has been cleared.");
    
    const serverResult = await updateServerCart([]);
    if (!serverResult) {
      setCart(originalCart);
      toast.error("Could not clear cart. Please try again.");
    }
  };

  const cartItemCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () => cart.reduce(
      (total, item) => total + (item.discountedPrice || item.price || 0) * item.quantity,
      0
    ),
    [cart]
  );

  const value = {
    cart,
    addToCart,
    decrementCartItem,
    removeFromCart,
    clearCart,
    loading,
    cartItemCount,
    cartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
