import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, role, employeeId? }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = () => user?.role === 'ROLE_ADMIN';

  const refreshUser = () => {
    return getCurrentUser()
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  };

  const clearUser = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, refreshUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
