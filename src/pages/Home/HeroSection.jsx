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
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 mb-6 text-xs sm:text-sm font-semibold tracking-wider text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-fade-in-up">
            New Collection 2026
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight animate-slide-up text-center drop-shadow-lg">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Wardrobe</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed text-center font-light">
            Discover our exclusive collection of finely crafted garments,
            designed to reflect your unique style and sophistication.
          </p>

          {/* CTA Button */}
          <button
            className="group relative bg-white text-black px-8 py-4 rounded-full font-bold text-base hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
            onClick={() => navigate("/products")}
          >
            <span className="relative z-10 flex items-center gap-2">
              Shop Now
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
          </button>

          {/* Animated Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16 mt-16 sm:mt-24 w-full max-w-3xl border-t border-white/10 pt-8 sm:pt-12">
            <div className="flex flex-col items-center">
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                <Counter target={200} />
              </p>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">
                International Brands
              </p>
            </div>
            <div className="flex flex-col items-center border-l border-r border-white/10 px-4">
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                <Counter target={2000} />
              </p>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">
                High-Quality Products
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                <Counter target={30000} />
              </p>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">
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