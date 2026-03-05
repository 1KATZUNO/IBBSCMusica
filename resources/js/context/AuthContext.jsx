import { createContext, useState, useEffect } from 'react';
import api from '../api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Handle OAuth token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      // Fetch user info
      api.get('/auth/user').then(({ data }) => {
        localStorage.setItem('auth_user', JSON.stringify(data));
        setUser(data);
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('auth_token');
        setLoading(false);
      });
    } else if (localStorage.getItem('auth_token')) {
      // Refresh user data on load
      api.get('/auth/user').then(({ data }) => {
        localStorage.setItem('auth_user', JSON.stringify(data));
        setUser(data);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const setupOrganization = async (orgName) => {
    const { data } = await api.post('/auth/setup-organization', { name: orgName });
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const leaveOrganization = async () => {
    const { data } = await api.post('/auth/leave-organization');
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';
  const needsOrganization = isLoggedIn && !user?.organization_id;

  return (
    <AuthContext.Provider value={{
      user, setUser, isLoggedIn, isAdmin, needsOrganization,
      login, register, setupOrganization, leaveOrganization, logout, loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
