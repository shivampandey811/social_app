import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/users/check-auth/');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/users/login/', { username, password });
      setUser(response.data.user);
      console.log(response.data.sessionid)
      localStorage.setItem('sessionid', response.data.sessionid); // Store session ID in local storage
    } catch (error) {
      console.error('Login error: ', error);
    }
  };

  const logout = async () => {
    try {
      await api.post('/users/logout/');
      setUser(null);
      localStorage.removeItem('sessionid'); // Remove session ID from local storage on logout
    } catch (error) {
      console.error('Logout error: ', error);
    }
  };

  const register = async (username, password, email) => {
    try {
      await api.post('/users/register/', { username, password, email });
    } catch (error) {
      console.error('Registration error: ', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
