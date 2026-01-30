import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/axiosConfig';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/products/');
      let data = response.data;
      
      // Handle Django DRF pagination (if results key exists)
      if (data.results && Array.isArray(data.results)) {
        data = data.results;
      }
      
      if (!Array.isArray(data)) {
        console.error("API did not return a list of products:", data);
        setProducts([]);
        setError("Invalid data received from server.");
        return;
      }

      // Construct full image URLs for each product
      const productsWithImages = data.map(product => ({
        ...product,
        image: product.image 
          ? (product.image.startsWith('http') 
              ? product.image 
              : `${api.defaults.baseURL}${product.image}`)
          : null
      }));
      
      setProducts(productsWithImages);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      // Don't set error if it's just a 404 from empty DB, treat as empty
      if (err.response && err.response.status === 404) {
          setProducts([]);
          setError(null);
      } else {
          setError("Failed to load products.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      // Backend: GET /categories/ -> [{ id, name, slug, parent, children }]
      const response = await api.get('/api/categories/');
      // We might need to flatten or just pass 'name' for the filter if the UI expects list of strings.
      // But the ProductList component I updated earlier handles objects { id, name }.
      
      // If the backend returns tree structure (children), we might want to flatten it for a simple list filter?
      // Or just take the top-level categories. 
      // User's CategoryListView returns `parent__isnull=True`. So top level only.
      // UI expects simple categories. We'll pass the list.
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const addProduct = (newProduct) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  const value = {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    addProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};