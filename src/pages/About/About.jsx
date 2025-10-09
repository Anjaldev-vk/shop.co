import React from "react";
import Footer from "../../components/Footer";
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About SHOP.CO</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          At SHOP.CO, we are passionate about delivering high-quality products
          with an exceptional shopping experience. Our mission is to make
          shopping easy, fun, and reliable for everyone.
        </p>
      </div>

      {/* Company Story */}
      <div className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          SHOP.CO started with a simple idea: to create an online store that
          combines quality products with excellent customer service. We carefully
          select each product, ensuring that it meets our high standards and
          delivers value to our customers.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed">
          Our team works tirelessly to improve the shopping experience, from
          browsing our catalog to receiving your order at your doorstep. We
          believe shopping should be convenient, secure, and enjoyable.
        </p>
      </div>

    

      {/* Mission / Contact */}
      <div className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          To provide high-quality products, exceptional customer service, and
          an enjoyable online shopping experience that keeps our customers
          coming back.
        </p>
        <p className="text-gray-600 text-lg">
          Contact us anytime at{" "}
          <a href="mailto:support@shop.co" className="text-indigo-600 font-semibold">
            support@shop.co
          </a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
