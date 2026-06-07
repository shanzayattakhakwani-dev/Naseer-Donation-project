import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('naseer_user');
    const token  = localStorage.getItem('naseer_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { /* invalid */ }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('naseer_token', data.token);
    localStorage.setItem('naseer_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (firstName, lastName, email, password) => {
    const { data } = await api.post('/auth/register', { firstName, lastName, email, password });
    localStorage.setItem('naseer_token', data.token);
    localStorage.setItem('naseer_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('naseer_token');
    localStorage.removeItem('naseer_user');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('naseer_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
