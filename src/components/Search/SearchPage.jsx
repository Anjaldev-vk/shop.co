import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

// Sample products data (replace with your real data / fetch from API)
import productsData from "../data/products.json"; 

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query")?.toLowerCase() || "";

  const [results, setResults] = useState([]);

  useEffect(() => {
    const filtered = productsData.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query))
    );
    setResults(filtered);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for: <span className="text-indigo-600">{query}</span>
      </h2>

      {results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="border rounded p-4 hover:shadow-lg transition">
              <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover mb-2" />
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
