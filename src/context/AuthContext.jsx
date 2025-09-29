import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; // Using axios for consistency with other examples

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUserSession = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3001/users/${userId}`);
          const user = response.data;
          // Also check if the restored user is blocked
          if (user && !user.isBlock) {
            setCurrentUser(user);
          } else {
            localStorage.removeItem("userId"); // Clear session if user is blocked or deleted
          }
        } catch (error) {
          console.error("Failed to restore session:", error);
          localStorage.removeItem("userId");
        }
      }
      setLoading(false);
    };
    restoreUserSession();
  }, []);

  const login = async (username, password) => {
    const response = await axios.get(`http://localhost:3001/users?username=${username}&password=${password}`);
    const users = response.data;

    if (users.length === 1) {
      const user = users[0];

      // --- FIX: Check if the user is blocked BEFORE logging them in ---
      if (user.isBlock) {
        throw new Error("You were blocked by admin.");
      }
      // --- END OF FIX ---

      setCurrentUser(user);
      localStorage.setItem("userId", user.id);
      return user;
    } else {
      throw new Error("Invalid username or password.");
    }
  };
  
  const signup = async (username, email, password) => {
    const userCheckResponse = await axios.get(`http://localhost:3001/users?username=${username}`);
    if (userCheckResponse.data.length > 0) {
      throw new Error("Username is already taken.");
    }
    
    const newUser = {
      username,
      email,
      password,
      role: "user",
      isBlock: false,
      profilePhoto: null,
      cart: [],
      orders: [],
      wishlist: [],
      created_at: new Date().toISOString(),
    };

    const createResponse = await axios.post('http://localhost:3001/users', newUser);
    const createdUser = createResponse.data;

    setCurrentUser(createdUser);
    localStorage.setItem("userId", createdUser.id);
    return createdUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("userId");
  };

  const isAdmin = currentUser?.role === "admin";

  const value = {
    currentUser,
    login,
    logout,
    signup,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};