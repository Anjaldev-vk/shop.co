import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Shared components
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

// User-facing pages
import HomePage from './pages/Home/HomePage';
import Cart from './pages/Cart/Cart';
import ProductList from './pages/Products/ProductList';
import ProductDetails from './pages/Products/ProductDetails';
import WishlistPage from './pages/Wishlist/WishList';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Checkout from './pages/Checkout/Checkout';
import OrderSuccess from './pages/Checkout/OrderSuccess';
import About from './pages/About/About';
import ProtectedRoute from './components/ProtectdRoute';
import MyOrders from './pages/MyOrders/MyOrders';
import ContactPage from './pages/Contact/ContactPage';

// Admin pages (from src/admin)
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ManageProduct from './admin/ManageProduct';
import ViewOrders from './admin/ViewOrders';
import ManageUsers from './admin/ManageUsers';
import AdminRoute from './admin/AdminRoute';

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
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster position="top-right" gutter={15} toastOptions={{ duration: 1000 }} />
            <Routes>
              <Route element={<AppLayout />}> 
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Protected routes (login required) */}
                <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              </Route>

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<ManageProduct />} />
                <Route path="orders" element={<ViewOrders />} />
                <Route path="users" element={<ManageUsers />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
