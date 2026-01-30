import React, { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { jwtDecode } from "jwt-decode"; // You might need to install this: npm install jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to check if token is valid
  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const restoreUserSession = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      
      if (accessToken && isTokenValid(accessToken)) {
        try {
          // Fetch user profile to ensure token works and get up-to-date info
          const response = await api.get('api/accounts/profile/');
          setCurrentUser(response.data); 
        } catch (error) {
          console.error("Failed to restore session:", error);
          logout(); 
        }
      } else {
        // If token invalid or missing, clear everything
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
      }
      setLoading(false);
    };
    
    restoreUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('api/accounts/login/', { email, password });
      const { access, refresh, user } = response.data;

      // Store tokens
      sessionStorage.setItem("accessToken", access);
      sessionStorage.setItem("refreshToken", refresh); 

      setCurrentUser(user);
      return user;
    } catch (error) {
        // Throw the error response data if available, or a generic message
        if (error.response && error.response.data) {
             throw error.response.data; // e.g. { error: "Account not verified" }
        }
      throw new Error("Login failed. Please check your credentials.");
    }
  };
  
  const signup = async (name, email, password) => {
      try {
        const response = await api.post('/api/accounts/register/', { name, email, password });
        return response.data; // { message, email, otp }
      } catch (error) {
           if (error.response && error.response.data) {
                // Return the specific error message from backend if possible
                const errorMsg = error.response.data.error || Object.values(error.response.data)[0];
                throw new Error(errorMsg);
           }
           throw new Error("Registration failed.");
      }
  };

  const verifyOtp = async (email, otp) => {
      try {
          const response = await api.post('api/accounts/verify-otp/', { email, otp });
          return response.data;
      } catch (error) {
           if (error.response && error.response.data) {
             throw new Error(error.response.data.error);
           }
          throw new Error("Verification failed.");
      }
  }

  const resendOtp = async (email) => {
      try {
          const response = await api.post('api/accounts/resend-otp/', { email });
          return response.data;
      } catch (error) {
          if (error.response && error.response.data) {
            throw new Error(error.response.data.error);
          }
           throw new Error("Failed to resend OTP.");
      }
  }

  const forgotPassword = async (email) => {
       try {
        const response = await api.post('api/accounts/password-reset-request/', { email });
        return response.data;
       } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error);
        }
        throw new Error("Failed to request password reset.");
       }
  }

  const resetPassword = async (email, otp, new_password) => {
      try {
          const response = await api.post('api/accounts/password-reset-confirm/', { email, otp, new_password });
          return response.data;
      } catch (error) {
           if (error.response && error.response.data) {
               throw new Error(error.response.data.error);
           }
           throw new Error("Password reset failed.");
      }
  }


  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    // Optionally call backend logout endpoint if you implemented blacklist
  };

  const isAdmin = currentUser?.role === "admin";

  const value = {
    currentUser,
    login,
    logout,
    signup,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
