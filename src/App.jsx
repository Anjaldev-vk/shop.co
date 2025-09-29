import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Your existing pages and components
import HomePage from './pages/HomePage';
import Cart from './components/Cart/Cart';
import ProductList from './components/Products/ProductList';
import ProductDetails from './components/Products/ProductDetails';
import WishlistPage from './pages/WishList';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Auth/Profile';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Checkout from './pages/Chechout';
import About from './pages/About';
import ProtectedRoute from './context/ProtectedRoute';
import MyOrders from './pages/MyOrders';
import ContactPage from './components/contactPage/ContactPage';

// Import your admin pages
import AdminLayout from './components/Admin/AdminLayout';// <<<--- IMPORTED
import AdminDashboard from './components/Admin/AdiminDashbord';
import ManageProducts from './components/Admin/ManageProducts';
import ManageUsers from './components/Admin/ManageUsers';
import ViewOrders from './components/Admin/ViewOrders';

// Layout for user-facing pages
const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Routes>
            {/* ======================================== */}
            {/* User Routes (with Navbar)                */}
            {/* ======================================== */}
            <Route element={<AppLayout />}>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/about" element={<About />} />

              {/* Protected routes (login required) */}
              <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* ======================================== */}
            {/* Admin Routes (with AdminLayout)          */}
            {/* ======================================== */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout /> {/* <<<--- CHANGED to use your layout */}
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="orders" element={<ViewOrders />} /> 
            </Route>

          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;