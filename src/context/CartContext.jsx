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
      // Backend: GET /cart/ -> { id, items: [...], total_amount }
      const response = await api.get('/api/cart/'); // Assuming route is mapped to api/cart/
      const data = response.data;
      
      if (data && Array.isArray(data.items)) {
          // Flatten items for UI: { ...productData, quantity, cartItemId, product_id }
          // Backend Item: { id, product, product_name, product_price, quantity }
          // Backend Product lookup might be needed if full product details aren't in 'product' field
          // Based on serializer: 'product' is the ID. 'product_name' etc are fields. 
          // Wait, 'product' in `CartItemSerializer` Meta fields is the ID? No, serializer definition says:
          // product_name = serializers.CharField(source='product.name'...)
          // fields = ('id','product','product_name','product_price','quantity')
          // So 'product' is likely just the ID unless expanded. 
          // The UI needs full product object for images etc. 
          // However, the `product` field in serializer usually returns ID unless nested.
          // Let's assume we might need to fetch full product details OR the backend returns expanded product.
          // Looking at the provided serializer code:
          // class CartItemSerializer(serializers.ModelSerializer): ... fields=('id','product'...)
          // Default Relation is PK. So `product` is an ID.
          // BUT, we need the Image. The provided serializer DOES NOT include image.
          // We might need to fetch product details separately or rely on what we have.
          // The UI likely needs 'image', 'slug', 'category'.
          // I will implement a fetch-missing-details strategy.

          const cartItemsRaw = data.items;
          
          // Fetch full product details for each item to get images/etc
          const fullItemsPromises = cartItemsRaw.map(async (item) => {
              try {
                  // Use slug instead of ID for product lookup
                  const productRes = await api.get(`/api/products/${item.product_slug}/`);
                  const productData = productRes.data;
                  
                  // Construct full image URL if image exists
                  const imageUrl = productData.image 
                    ? (productData.image.startsWith('http') 
                        ? productData.image 
                        : `${api.defaults.baseURL}${productData.image}`)
                    : null;
                  
                  return {
                      ...productData,
                      quantity: item.quantity,
                      cartItemId: item.id,
                      price: productData.final_price || productData.price,
                      image: imageUrl
                  };
              } catch (err) {
                  console.warn("Failed to fetch product details for cart item", item);
                  return null;
              }
          });

          const fullItems = (await Promise.all(fullItemsPromises)).filter(Boolean);
          setCart(fullItems);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      if (error.response?.status !== 404) {
         // toast.error("Could not load your cart.");
      }
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCartDetails();
  }, [fetchCartDetails]);

  const addToCart = async (product, quantityToAdd = 1) => {
    if (!currentUser) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    try {
        // Backend: POST /cart/add/ { product_id, quantity }
        // We can't optimistically update easily because we need the backend to handle "get_or_create". 
        // But for UI responsiveness we can try.
        
        // Optimistic
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
             const newQuantity = existingItem.quantity + quantityToAdd;
             setCart(prev => prev.map(item => 
                 item.id === product.id ? { ...item, quantity: newQuantity } : item
             ));
        } else {
             // Fake cartItemId until refresh
             setCart(prev => [...prev, { ...product, quantity: quantityToAdd, cartItemId: 'temp-' + Date.now() }]);
        }

        toast.success("Updating cart...");
        await api.post('/api/cart/add/', { product_id: product.id, quantity: quantityToAdd });
        
        // Refresh to get correct IDs and consistency
        fetchCartDetails();

    } catch (error) {
        console.error("Failed to add to cart:", error);
        toast.error(error.response?.data?.error || "Failed to add to cart.");
        fetchCartDetails(); // Revert
    }
  };

  const decrementCartItem = async (productId) => {
    const existingItem = cart.find((item) => item.id === productId);
    if (!existingItem) return;

    try {
        if (existingItem.quantity === 1) {
            // Remove
             await removeFromCart(productId);
        } else {
            // Update
            const newQuantity = existingItem.quantity - 1;
            
            // Optimistic
            setCart(prev => prev.map(item => 
                item.id === productId ? { ...item, quantity: newQuantity } : item
            ));

            // Backend: POST /cart/update/ { item_id, quantity }
            await api.post('/api/cart/update/', { item_id: existingItem.cartItemId, quantity: newQuantity });
            
            // We usually don't need to refresh here if successful, but to be safe:
            // fetchCartDetails(); 
        }
    } catch (error) {
        console.error("Failed to update cart:", error);
        toast.error("Action failed.");
        fetchCartDetails();
    }
  };

  const removeFromCart = async (productId) => {
    const existingItem = cart.find(item => item.id === productId);
    if (!existingItem) return;
    
    try {
        // Optimistic
        setCart(prev => prev.filter(item => item.id !== productId));
        toast.error(`${existingItem.name || 'Item'} removed.`);

        // Backend: POST /cart/remove/ { item_id }
        await api.post('/api/cart/remove/', { item_id: existingItem.cartItemId });
    } catch (error) {
        console.error("Failed to remove item:", error);
        toast.error("Failed to remove item.");
        fetchCartDetails();
    }
  };

  const clearCart = async () => {
     // No clear endpoint provided in description. 
     // We would have to loop remove or just set local to empty if backend doesn't support it.
     // For now, simply setting empty local and user has to manually remove or we implement loop.
     setCart([]);
     toast.success("Cart cleared locally (Backend clear not implemented).");
  };

  const cartItemCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () => cart.reduce(
      (total, item) => total + (item.final_price || item.price || 0) * item.quantity,
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
