import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 px-4 sm:px-6 md:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-8 sm:p-12 mb-16 flex flex-col lg:flex-row justify-between items-center rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 mb-8 lg:mb-0 lg:mr-8 max-w-xl">
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
              STAY UP TO DATE ABOUT OUR LATEST OFFERS
            </h3>
            <p className="text-indigo-200">Join our newsletter to get exclusive deals and fashion tips.</p>
          </div>
          <div className="relative z-10 w-full lg:w-auto">
             <div className="flex flex-col sm:flex-row gap-3 bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/20">
              <input
                type="email"
                placeholder="Enter your email address"
                className="p-4 w-full sm:w-80 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-500"
              />
              <button className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-12 text-gray-400 mb-16">
          <div className="lg:col-span-2">
            <h4 className="text-3xl font-extrabold text-white mb-6 tracking-tighter">
              SHOP.CO
            </h4>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'instagram', 'github'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 border border-gray-800 hover:border-white">
                   <span className="sr-only">{social}</span>
                   {/* Placeholder icons, replace with actual SVGs or FontAwesome */}
                   <div className="w-5 h-5 bg-current rounded-full opacity-50"></div>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Company</h4>
            <ul className="space-y-4 text-sm">
              {['About', 'Features', 'Works', 'Career'].map((item) => (
                 <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Help</h4>
            <ul className="space-y-4 text-sm">
              {['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                 <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Resources</h4>
             <ul className="space-y-4 text-sm">
              {['Free eBooks', 'Development Tutorial', 'How to - Blog', 'Youtube Playlist'].map((item) => (
                 <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">Shop.co © 2000-2025. All Rights Reserved</p>
          <div className="flex space-x-4 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
             <img src="https://tse2.mm.bing.net/th/id/OIP._VhDEZTT9T5bcaNTLp75pwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Visa" className="h-8 bg-white rounded px-1" />
             <img src="https://clipground.com/images/visa-mastercard-icon-png-2.jpg" alt="Mastercard" className="h-8 bg-white rounded px-1" />
             <img src="https://tse4.mm.bing.net/th/id/OIP.Wyu_7O9M0lmASmXeTPBxLQHaJF?rs=1&pid=ImgDetMain&o=7&rm=3" alt="PayPal" className="h-8 bg-white rounded px-1" />
             <img src="https://logospng.org/wp-content/uploads/google-pay.png" alt="Google Pay" className="h-8 bg-white rounded px-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;