import React, { useEffect, useState } from "react";
import BrandSection from "./brandSection.jsx";
import { useNavigate } from "react-router-dom";
import vedio from '../../assets/hero.mp4'

// No changes needed for the Counter component
const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    const increment = end / (duration / 16);
    let current = start;

    const animate = () => {
      current += increment;
      if (current < end) {
        setCount(Math.floor(current));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
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
      {/* Main container with background video */}
      <div
        className="relative flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[80vh] text-center px-4 py-16 overflow-hidden bg-black"
      >
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={vedio}
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        {/* Content, now with z-10 to be on top of the overlay */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Text color changed to white */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-white mb-4 tracking-wide animate-slide-up">
            Elevate Your Wardrobe
          </h1>
          {/* Text color changed to a light gray */}
          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover our exclusive collection of finely crafted garments,
            designed to reflect your unique style and sophistication.
          </p>
          <button
            className="bg-gray-900 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-md font-medium text-sm sm:text-base hover:bg-gray-700 hover:shadow-xl transition-all duration-300"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>

          {/* Animated Counters container text color changed to white */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 mt-12 text-white">
            <div className="flex flex-col items-center">
              <p className="text-2xl sm:text-3xl font-bold">
                <Counter target={200} />
              </p>
              {/* Subtext color changed to a lighter gray */}
              <p className="text-xs sm:text-sm text-gray-300">
                International Brands
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl sm:text-3xl font-bold">
                <Counter target={2000} />
              </p>
              <p className="text-xs sm:text-sm text-gray-300">
                High-Quality Products
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl sm:text-3xl font-bold">
                <Counter target={30000} />
              </p>
              <p className="text-xs sm:text-sm text-gray-300">
                Happy Customers
              </p>
            </div>
          </div>
        </div>

        {/* Animation styles remain unchanged */}
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