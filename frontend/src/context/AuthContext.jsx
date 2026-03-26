import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, role, employeeId? }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(res => {
        console.log('DEBUG: Fetched user data:', res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.warn('DEBUG: No active session found:', err.response?.status);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = () => {
    const role = user?.role;
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
  };

  const refreshUser = () => {
    return getCurrentUser()
      .then(res => {
        console.log('DEBUG: refreshUser - Fetched user data:', res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.warn('DEBUG: refreshUser - Failed to fetch user:', err.response?.status);
        setUser(null);
      });
  };

  const clearUser = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, refreshUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
