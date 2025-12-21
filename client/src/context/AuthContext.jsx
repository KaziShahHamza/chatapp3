// src/context/AuthContext.js
import { createContext, useContext, useState } from 'react';
import { getStoredUser, logout as logoutService } from '../services/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const token = localStorage.getItem('token');

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
