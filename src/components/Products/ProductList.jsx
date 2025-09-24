// ProductList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(true); // toggle sidebar
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 500],
    minRating: 0,
  });

  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    const price =
      product.discountedPrice || product.price || product.originalPrice || 0;

    return (
      (filters.category ? product.category === filters.category : true) &&
      price >= filters.priceRange[0] &&
      price <= filters.priceRange[1] &&
      product.rating >= filters.minRating
    );
  });

  return (
    <div className="flex">
      {/* Sidebar Filters */}
      {showFilters && (
        <div className="w-1/4 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block font-medium">Category</label>
            <select
              className="w-full border p-2 rounded"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="T-Shirt">T-Shirt</option>
              <option value="Jeans">Jeans</option>
              <option value="Shirt">Shirt</option>
              <option value="Shorts">Shorts</option>
              <option value="Jacket">Jacket</option>
              <option value="Hoodie">Hoodie</option>
              <option value="Pants">Pants</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <label className="block font-medium">
              Price Range (${filters.priceRange[0]} - ${filters.priceRange[1]})
            </label>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [0, Number(e.target.value)],
                })
              }
              className="w-full"
            />
          </div>

          {/* Rating Filter */}
          <div className="mb-4">
            <label className="block font-medium">
              Min Rating: {filters.minRating}★
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) =>
                setFilters({ ...filters, minRating: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className={`${showFilters ? "w-3/4" : "w-full"} p-4`}>
        {/* Toggle Filter Button */}
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        <div
          className={`grid gap-6 ${
            showFilters
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
          }`}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
