// src/context/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation(); // to remember the page user wanted to visit

  // Show loading state while auth is being checked
  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // User is logged in, render the protected page
  return children;
};

export default ProtectedRoute;
