import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial app load, check if a user ID is in localStorage to restore the session
  useEffect(() => {
    const restoreUserSession = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          // Fetch the full user object from the database
          const response = await fetch(`http://localhost:3001/users/${userId}`);
          if (response.ok) {
            const user = await response.json();
            setCurrentUser(user);
          } else {
            // If user not found (e.g., deleted), clear the session
            localStorage.removeItem("userId");
          }
        } catch (error) {
          console.error("Failed to restore session:", error);
        }
      }
      setLoading(false);
    };

    restoreUserSession();
  }, []);

  // Login function now takes credentials and validates against the database
  const login = async (username, password) => {
    // Use json-server's query feature to find the user directly
    const response = await fetch(`http://localhost:3001/users?username=${username}&password=${password}`);
    const users = await response.json();

    if (users.length === 1) {
      const user = users[0];
      setCurrentUser(user);
      // Store only the user's ID to persist the session
      localStorage.setItem("userId", user.id);
      return user; // Return the user object on successful login
    } else {
      // Throw an error if credentials are wrong
      throw new Error("Invalid username or password.");
    }
  };
  
  // New signup function to create users in the database
  const signup = async (username, email, password) => {
    // 1. Check if username already exists
    const userCheckResponse = await fetch(`http://localhost:3001/users?username=${username}`);
    const existingUsers = await userCheckResponse.json();

    if (existingUsers.length > 0) {
      throw new Error("Username is already taken.");
    }
    
    // 2. Create the new user object with default empty fields
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

    // 3. Send a POST request to create the user
    const createResponse = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (!createResponse.ok) {
      throw new Error("Failed to create account.");
    }
    
    const createdUser = await createResponse.json();

    // 4. Automatically log the new user in
    setCurrentUser(createdUser);
    localStorage.setItem("userId", createdUser.id);
    return createdUser;
  };

  // Logout function clears state and removes the user ID from localStorage
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("userId");
  };

  const isAdmin = currentUser?.role === "admin";

  const value = {
    currentUser,
    login,
    logout,
    signup, // Provide the new signup function
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};