import React from "react";
import PageTransition from "../../components/PageTransition";
import NewArrivals from "../Home/NewArrivals";
import TopSelling from "../Home/TopSelling";
import HeroSection from "../Home/HeroSection";
import Footer from "../../components/Footer";

const HomePage = () => {
  return (
    <PageTransition>
      <div className="bg-gray-100 min-h-screen">
        <HeroSection />
        <NewArrivals />
        <TopSelling />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default HomePage;
