import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tripplanner_jwt') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: Bearer  }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setUser(data);
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const loginWithToken = (jwtToken, userData) => {
    localStorage.setItem('tripplanner_jwt', jwtToken);
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('tripplanner_jwt');
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
