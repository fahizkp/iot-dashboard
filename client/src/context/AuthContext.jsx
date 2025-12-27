import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  const verifyAuth = useCallback(async () => {
    try {
      const response = await authAPI.verify();
      if (response.data.authenticated) {
        setIsAuthenticated(true);
        setAdmin({ username: response.data.username });
      }
    } catch {
      setIsAuthenticated(false);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    if (response.data.success) {
      setIsAuthenticated(true);
      setAdmin({ username: credentials.username });
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setIsAuthenticated(false);
      setAdmin(null);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    admin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
