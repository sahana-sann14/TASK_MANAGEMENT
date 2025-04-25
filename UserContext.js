// src/context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create Context
const UserContext = createContext();

// Provide Context
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Set user details in context
  const setUserDetails = (userData) => {
    setCurrentUser(userData);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken'); // Clear token from local storage
  };

  // Fetch user details from API using the token
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setCurrentUser(null); // No token, clear user state
        return;
      }

      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data); // Set the user data from the API
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setCurrentUser(null); // Clear user on error
    }
  };

  useEffect(() => {
    fetchUserDetails(); // Fetch user details when the component mounts
  }, []); // Empty dependency array means it runs only once

  return (
    <UserContext.Provider value={{ currentUser, setUserDetails, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
