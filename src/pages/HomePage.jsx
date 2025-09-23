import React from 'react';
import ProductList from '../components/Products/ProductList';
import NewArrivals from './NewArrival';
import TopSelling from './TopSelling';
import HeroSection from './HeroSection';
import Footer from '../components/Footer/Footer';


const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <HeroSection />
 
     <NewArrivals />
      <TopSelling />
      {/* Main Content with Product Listings */}
      
      <Footer />
      {/* Footer */}
      
    </div>
  );
};

export default HomePage;