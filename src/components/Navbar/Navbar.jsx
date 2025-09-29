// import React, { useState, useEffect, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "../../context/CartContext";
// import { useWishlist } from "../../context/WishlistContext";
// import { AuthContext } from "../../context/AuthContext";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showNavbar, setShowNavbar] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   const navigate = useNavigate();
//   const { cart } = useCart();
//   const { wishlist } = useWishlist();
//   const { currentUser } = useContext(AuthContext);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//       if (isMenuOpen) toggleMenu();
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSearch(e);
//   };

//   // Redirect to login if not logged in
//   const handleProtectedClick = (path) => {
//     if (!currentUser) {
//       navigate("/login");
//     } else {
//       navigate(path);
//     }
//   };

//   // Hide navbar on scroll down, show on scroll up
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > lastScrollY) {
//         setShowNavbar(false);
//       } else {
//         setShowNavbar(true);
//       }
//       setLastScrollY(window.scrollY);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollY]);

//   return (
//     <>
//       <nav
//         className={`bg-white shadow-sm fixed w-full z-50 transition-transform duration-300 ${
//           showNavbar ? "translate-y-0" : "-translate-y-full"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             {/* Logo */}
//             <div className="flex-shrink-0">
//               <Link to="/" className="text-3xl font-sans font-bold text-gray-900">
//                 SHOP.CO
//               </Link>
//             </div>

//             {/* Desktop Menu */}
//             <div className="hidden md:flex items-center space-x-6">
//               <Link to="/" className="text-gray-700 hover:text-gray-900 transition">Home</Link>
//               <Link to="/products" className="text-gray-700 hover:text-gray-900 transition">Products</Link>
//               <Link to="/about" className="text-gray-700 hover:text-gray-900 transition">About</Link>
//               <Link to="/contact" className="text-gray-700 hover:text-gray-900 transition">Contact</Link>
//             </div>

//             {/* Search Bar */}
//             <div className="hidden md:block">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search for products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="w-64 px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <button
//                   onClick={handleSearch}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 7.65 7.5 7.5 0 0116.65 16.65z" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Icons */}
//             <div className="hidden md:flex items-center space-x-4">
//               <div onClick={() => handleProtectedClick("/cart")} className="relative text-gray-700 hover:text-gray-900 transition cursor-pointer">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//                 {cart.length > 0 && currentUser && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                     {cart.reduce((acc, item) => acc + item.quantity, 0)}
//                   </span>
//                 )}
//               </div>

//               <div onClick={() => handleProtectedClick("/wishlist")} className="relative text-gray-700 hover:text-gray-900 transition cursor-pointer">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//                 {wishlist.length > 0 && currentUser && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                     {wishlist.length}
//                   </span>
//                 )}
//               </div>

//               <Link to="/profile" className="relative text-gray-700 hover:text-gray-900 transition">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//               </Link>
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="md:hidden">
//               <button onClick={toggleMenu} className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none">
//                 <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 bg-cream-100">
//               <Link to="/products" className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition" onClick={toggleMenu}>Shop</Link>
//               <Link to="/on-sale" className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition" onClick={toggleMenu}>On Sale</Link>
//               <Link to="/new-arrivals" className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition" onClick={toggleMenu}>New Arrivals</Link>
//               <Link to="/brands" className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition" onClick={toggleMenu}>Brands</Link>

//               <div onClick={() => { toggleMenu(); handleProtectedClick("/cart"); }} className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition cursor-pointer">Cart</div>
//               <div onClick={() => { toggleMenu(); handleProtectedClick("/wishlist"); }} className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition cursor-pointer">Wishlist</div>

//               <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition" onClick={toggleMenu}>Profile</Link>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* spacing so content is not hidden */}
//       <div className="h-16"></div>
//     </>
//   );
// };

// export default Navbar;


















// import React, { useState, useEffect, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "../../context/CartContext";
// import { useWishlist } from "../../context/WishlistContext";
// import { AuthContext } from "../../context/AuthContext";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showNavbar, setShowNavbar] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   const navigate = useNavigate();
//   const { cart } = useCart();
//   const { wishlist } = useWishlist();
//   const { currentUser, logout } = useContext(AuthContext);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//       if (isMenuOpen) toggleMenu();
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSearch(e);
//   };

//   const handleProtectedClick = (path) => {
//     if (!currentUser) {
//       navigate("/login");
//     } else {
//       navigate(path);
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > lastScrollY) {
//         setShowNavbar(false);
//       } else {
//         setShowNavbar(true);
//       }
//       setLastScrollY(window.scrollY);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollY]);

//   return (
//     <>
//       <nav
//         className={`bg-white shadow-sm fixed w-full z-50 transition-transform duration-300 ${
//           showNavbar ? "translate-y-0" : "-translate-y-full"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             {/* Logo */}
//             <div className="flex-shrink-0">
//               <Link to="/" className="text-3xl font-sans font-bold text-gray-900">
//                 SHOP.CO
//               </Link>
//             </div>

//             {/* Desktop Menu */}
//             <div className="hidden md:flex items-center space-x-6">
//               <Link to="/" className="text-gray-700 hover:text-gray-900 transition">Home</Link>
//               <Link to="/products" className="text-gray-700 hover:text-gray-900 transition">Products</Link>
//               <Link to="/about" className="text-gray-700 hover:text-gray-900 transition">About</Link>
//               <Link to="/contact" className="text-gray-700 hover:text-gray-900 transition">Contact</Link>
//             </div>

//             {/* Search Bar */}
//             <div className="hidden md:block">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search for products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="w-64 px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <button
//                   onClick={handleSearch}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   🔍
//                 </button>
//               </div>
//             </div>

//             {/* Icons / Login */}
//             <div className="hidden md:flex items-center space-x-4">
//               <div onClick={() => handleProtectedClick("/cart")} className="relative text-gray-700 hover:text-gray-900 transition cursor-pointer">
//                 🛒
//                 {cart.length > 0 && currentUser && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                     {cart.reduce((acc, item) => acc + item.quantity, 0)}
//                   </span>
//                 )}
//               </div>

//               <div onClick={() => handleProtectedClick("/wishlist")} className="relative text-gray-700 hover:text-gray-900 transition cursor-pointer">
//                 ❤️
//                 {wishlist.length > 0 && currentUser && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                     {wishlist.length}
//                   </span>
//                 )}
//               </div>

//               {!currentUser ? (
//                 <Link to="/login" className="text-gray-700 hover:text-gray-900 transition">Login</Link>
//               ) : (
//                 <div className="flex items-center space-x-4">
//                   <Link to="/profile" className="text-gray-700 hover:text-gray-900 transition">Profile</Link>
//                   <button onClick={logout} className="text-gray-700 hover:text-gray-900 transition">Logout</button>
//                 </div>
//               )}
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="md:hidden">
//               <button onClick={toggleMenu} className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none">
//                 {isMenuOpen ? "✖" : "☰"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-100">
//               <Link to="/products" onClick={toggleMenu} className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition">Shop</Link>
//               <Link to="/on-sale" onClick={toggleMenu} className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition">On Sale</Link>
//               <Link to="/new-arrivals" onClick={toggleMenu} className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition">New Arrivals</Link>
//               <Link to="/brands" onClick={toggleMenu} className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition">Brands</Link>

//               <div onClick={() => { toggleMenu(); handleProtectedClick("/cart"); }} className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition cursor-pointer">Cart</div>
//               <div onClick={() => { toggleMenu(); handleProtectedClick("/wishlist"); }} className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition cursor-pointer">Wishlist</div>

//               {!currentUser ? (
//                 <Link to="/login" onClick={toggleMenu} className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition">Login</Link>
//               ) : (
//                 <>
//                   <Link to="/profile" onClick={toggleMenu} className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition">Profile</Link>
//                   <button onClick={logout} className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition w-full text-left">Logout</button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Spacer so content isn't hidden behind navbar */}
//       <div className="h-16"></div>
//     </>
//   );
// };

// export default Navbar;














import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { currentUser, logout } = useContext(AuthContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Redirect to login if user is not authenticated
  const handleProtectedClick = (path) => {
    if (!currentUser) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) { // Only hide after scrolling a bit
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`bg-white shadow-sm fixed w-full z-50 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-3xl font-sans font-bold text-gray-900">
                SHOP.CO
              </Link>
            </div>

            {/* Desktop Menu - Centered */}
            <div className="hidden md:flex flex-grow justify-center items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 transition font-medium">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-indigo-600 transition font-medium">Products</Link>
              <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition font-medium">Contact</Link>
            </div>

            {/* Icons / Login */}
            <div className="hidden md:flex items-center space-x-5">
              <div onClick={() => handleProtectedClick("/cart")} className="relative text-gray-700 hover:text-indigo-600 transition cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {cart.length > 0 && currentUser && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>

              <div onClick={() => handleProtectedClick("/wishlist")} className="relative text-gray-700 hover:text-indigo-600 transition cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {wishlist.length > 0 && currentUser && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </div>

              {!currentUser ? (
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition font-medium">Login</Link>
              ) : (
                <>
                  <Link to="/profile" className="text-gray-700 hover:text-indigo-600 transition font-medium">Profile</Link>
                  <button onClick={logout} className="text-gray-700 hover:text-indigo-600 transition font-medium">Logout</button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-500" onClick={toggleMenu}>Home</Link>
              <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-500" onClick={toggleMenu}>Products</Link>
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-500" onClick={toggleMenu}>About</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-500" onClick={toggleMenu}>Contact</Link>
              <div className="border-t border-gray-200 my-2"></div>
              <div onClick={() => { toggleMenu(); handleProtectedClick("/cart"); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-500 cursor-pointer">Cart</div>
              <div onClick={() => { toggleMenu(); handleProtectedClick("/wishlist"); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-500 cursor-pointer">Wishlist</div>
              <div className="border-t border-gray-200 my-2"></div>
              {!currentUser ? (
                <Link to="/login" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-500">Login</Link>
              ) : (
                <>
                  <Link to="/profile" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-500">Profile</Link>
                  <button onClick={() => { toggleMenu(); logout(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-500">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* spacing so content is not hidden by the fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;