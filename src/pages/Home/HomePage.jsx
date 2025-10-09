import React from "react";
import NewArrivals from "../Home/NewArrivals";
import TopSelling from "../Home/TopSelling";
import HeroSection from "../Home/HeroSection";
import Footer from "../../components/Footer";

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <HeroSection />
      <NewArrivals />
      <TopSelling />
      <Footer />
    </div>
  );
};

export default HomePage;
