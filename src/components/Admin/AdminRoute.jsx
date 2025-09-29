// src/components/Admin/AdminRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminRoute = () => {
  const { currentUser } = useContext(AuthContext);

  // Check if user is logged in and has the 'admin' role
  if (!currentUser) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }
  
  if (currentUser.role !== "admin") {
    // If logged in but not an admin, redirect to home or a "not authorized" page
    return <Navigate to="/" />;
  }

  // If user is an admin, render the nested admin pages
  return <Outlet />;
};

export default AdminRoute;