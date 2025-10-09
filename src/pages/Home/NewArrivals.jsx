import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useNewArrivals from "../../context/UseArrival";
import ProductCard from "../Products/ProductCard";

const NewArrivals = () => {
  const { newArrivals, loading, error } = useNewArrivals();
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const displayedProducts = showAll ? newArrivals : newArrivals.slice(0, 4);

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10 animate-slide-up">
          New Arrivals
        </h2>

        {loading ? (
          <div className="text-center text-gray-700">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">
            {error.message || "Failed to fetch products. Please try again."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}

        {newArrivals.length > 4 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              {showAll ? "Show Less" : "View All"}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NewArrivals;