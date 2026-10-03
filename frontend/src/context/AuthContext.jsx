import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApiRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tripplanner_jwt') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authApiRequest('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(data => {
          if (data && data.email) {
            setUser(data);
          } else {
            logout();
          }
        })
        .catch(() => {
          // If offline or token cached locally in standalone mode
          try {
            const savedUser = localStorage.getItem('tripplanner_user');
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            } else {
              logout();
            }
          } catch {
            logout();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const loginWithToken = (jwtToken, userData) => {
    localStorage.setItem('tripplanner_jwt', jwtToken);
    if (userData) {
      localStorage.setItem('tripplanner_user', JSON.stringify(userData));
    }
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('tripplanner_jwt');
    localStorage.removeItem('tripplanner_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithToken, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
