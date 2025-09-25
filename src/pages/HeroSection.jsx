import React, { useEffect, useState } from "react";
import BrandSection from "./brandSection.jsx";
import { useNavigate } from "react-router-dom";

const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    const increment = end / (duration / 16); // frame step (assuming ~60fps)
    let current = start;

    const animate = () => {
      current += increment;
      if (current < end) {
        setCount(Math.floor(current));
        requestAnimationFrame(animate);
      } else {
        setCount(end); // make sure it ends exactly
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{count.toLocaleString()}+</span>;
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative bg-gradient-to-b from-cream-100 to-white flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[80vh] text-center px-4 py-16 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-gray-900 mb-4 tracking-wide animate-slide-up">
            Elevate Your Wardrobe
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover our exclusive collection of finely crafted garments, designed
            to reflect your unique style and sophistication.
          </p>
          <button
            className="bg-gray-900 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-md font-medium text-sm sm:text-base hover:bg-gray-700 hover:shadow-xl transition-all duration-300"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>

          {/* Animated Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 mt-12 text-gray-800">
            <div className="flex flex-col items-center">
              <p className="text-2xl sm:text-3xl font-bold">
                <Counter target={200} />
              </p>
              <p className="text-xs sm:text-sm">International Brands</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl sm:text-3xl font-bold">
                <Counter target={2000} />
              </p>
              <p className="text-xs sm:text-sm">High-Quality Products</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl sm:text-3xl font-bold">
                <Counter target={30000} />
              </p>
              <p className="text-xs sm:text-sm">Happy Customers</p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-up {
            animation: slide-up 0.8s ease-out forwards;
          }
        `}</style>
      </div>
      <BrandSection />
    </>
  );
};

export default HeroSection;
