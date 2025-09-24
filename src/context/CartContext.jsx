import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext"; // import AuthContext
import { useContext as useAuthContext } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuthContext(AuthContext); // get logged-in user

  const [cart, setCart] = useState(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!currentUser) {
      alert("You need to log in first!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const decrementCartItem = (productId) => {
    if (!currentUser) {
      alert("You need to log in first!");
      return;
    }

    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    if (!currentUser) {
      alert("You need to log in first!");
      return;
    }
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (!currentUser) {
      alert("You need to log in first!");
      return;
    }
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, decrementCartItem, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
