import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/axiosConfig';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      // Sort by creation date descending to show newest first
      const sortedProducts = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setProducts(sortedProducts);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = (newProduct) => {
    // Add the new product to the top of the list to ensure it's immediately visible
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts, // Expose the fetch function
    addProduct,    // Expose the new add function
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};