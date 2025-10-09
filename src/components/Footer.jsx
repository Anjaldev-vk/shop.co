import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 xs:py-8 sm:py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-7xl mx-auto">
        <div className="bg-black text-white p-4 xs:p-5 sm:p-6 mb-6 xs:mb-8 flex flex-col sm:flex-row justify-between items-center rounded-lg">
          <div className="mb-4 sm:mb-0 sm:mr-4">
            <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-center sm:text-left">
              STAY UP TO DATE ABOUT OUR LATEST OFFERS
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-3 bg-slate-100 text-slate-800 p-4 rounded-lg shadow-sm">
            <input
              type="email"
              placeholder="Enter your email address"
              className="p-2 xs:p-2.5 sm:p-3 w-full sm:w-64 rounded-l-lg sm:rounded-lg border-none outline-none text-black text-sm xs:text-base"
            />
            <button className="bg-white text-black p-2 xs:p-2.5 sm:p-3 rounded-r-lg sm:rounded-lg w-full sm:w-auto text-sm xs:text-base">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 xs:gap-8 text-gray-600">
          <div>
            <h4 className="text-lg xs:text-xl font-bold text-black mb-3 xs:mb-4">
              SHOP.CO
            </h4>
            <p className="text-sm xs:text-base">
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="flex space-x-3 xs:space-x-4 mt-3 xs:mt-4">
              <a href="#">
                <span className="w-5 h-5 xs:w-6 xs:h-6 bg-gray-300 rounded-full inline-block"></span>
              </a>
              <a href="#">
                <span className="w-5 h-5 xs:w-6 xs:h-6 bg-gray-300 rounded-full inline-block"></span>
              </a>
              <a href="#">
                <span className="w-5 h-5 xs:w-6 xs:h-6 bg-gray-300 rounded-full inline-block"></span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg xs:text-xl font-bold text-black mb-3 xs:mb-4">
              COMPANY
            </h4>
            <ul className="space-y-1 xs:space-y-2 text-sm xs:text-base">
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Features</a>
              </li>
              <li>
                <a href="#">Works</a>
              </li>
              <li>
                <a href="#">Career</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg xs:text-xl font-bold text-black mb-3 xs:mb-4">
              HELP
            </h4>
            <ul className="space-y-1 xs:space-y-2 text-sm xs:text-base">
              <li>
                <a href="#">Customer Support</a>
              </li>
              <li>
                <a href="#">Delivery Details</a>
              </li>
              <li>
                <a href="#">Terms & Conditions</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg xs:text-xl font-bold text-black mb-3 xs:mb-4">
              FAQ
            </h4>
            <ul className="space-y-1 xs:space-y-2 text-sm xs:text-base">
              <li>
                <a href="#">Account</a>
              </li>
              <li>
                <a href="#">Manage Deliveries</a>
              </li>
              <li>
                <a href="#">Orders</a>
              </li>
              <li>
                <a href="#">Payments</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg xs:text-xl font-bold text-black mb-3 xs:mb-4">
              RESOURCES
            </h4>
            <ul className="space-y-1 xs:space-y-2 text-sm xs:text-base">
              <li>
                <a href="#">Free eBooks</a>
              </li>
              <li>
                <a href="#">Development Tutorial</a>
              </li>
              <li>
                <a href="#">How to - Blog</a>
              </li>
              <li>
                <a href="#">Youtube Playlist</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 xs:mt-8 text-gray-500 text-xs xs:text-sm">
          <p>Shop.co © 2000-2025. All Rights Reserved</p>
          <div className="flex space-x-3 xs:space-x-4 mt-3 sm:mt-0">
            <img
              src="https://tse2.mm.bing.net/th/id/OIP._VhDEZTT9T5bcaNTLp75pwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Visa"
              className="h-6 xs:h-7"
            />
            <img
              src="https://clipground.com/images/visa-mastercard-icon-png-2.jpg"
              alt="Mastercard"
              className="h-5 xs:h-6"
            />
            <img
              src="https://tse4.mm.bing.net/th/id/OIP.Wyu_7O9M0lmASmXeTPBxLQHaJF?rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="PayPal"
              className="h-4 xs:h-5"
            />
            <img
              src="https://logospng.org/wp-content/uploads/google-pay.png"
              alt="Google Pay"
              className="h-5 xs:h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;