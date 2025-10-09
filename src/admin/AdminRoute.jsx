// src/components/Admin/AdminRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = () => {
  const { currentUser } = useContext(AuthContext);

  // Check if user is logged in and has the 'admin' role
  if (!currentUser) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }
  
  if (currentUser.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;