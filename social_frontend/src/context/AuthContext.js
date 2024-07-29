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
    const response = await api.post('/users/login/', { username, password });
    setUser(response.data.user);
  };

  const logout = async () => {
    await api.post('/users/logout/');
    setUser(null);
  };

  const register = async (username, password, email) => {
    await api.post('/users/register/', { username, password, email });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
