import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setToken, removeToken, getToken, setOnUnauthorized } from '../api/client';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  organization_id: number | null;
  organization?: { id: number; name: string; slug: string };
  avatar?: string;
  google_id?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
  isAdmin: boolean;
  needsOrganization: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  loginWithGoogleToken: (idToken: string) => Promise<User>;
  setupOrganization: (orgName: string) => Promise<any>;
  leaveOrganization: () => Promise<any>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On 401, clear user state
  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      AsyncStorage.removeItem('auth_user');
    });
  }, []);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const saved = await AsyncStorage.getItem('auth_user');
          if (saved) setUser(JSON.parse(saved));
          // Refresh user from server
          const { data } = await api.get('/auth/user');
          await AsyncStorage.setItem('auth_user', JSON.stringify(data));
          setUser(data);
        }
      } catch {
        // token expired or invalid
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    await setToken(data.token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    await setToken(data.token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const loginWithGoogleToken = useCallback(async (idToken: string) => {
    const { data } = await api.post('/auth/google-mobile', { idToken });
    await setToken(data.token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const setupOrganization = useCallback(async (orgName: string) => {
    const { data } = await api.post('/auth/setup-organization', { name: orgName });
    await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const leaveOrganization = useCallback(async () => {
    const { data } = await api.post('/auth/leave-organization');
    await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    await removeToken();
    await AsyncStorage.removeItem('auth_user');
    setUser(null);
  }, []);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';
  const needsOrganization = isLoggedIn && !user?.organization_id;

  return (
    <AuthContext.Provider
      value={{
        user, setUser, isLoggedIn, isAdmin, needsOrganization, loading,
        login, register, loginWithGoogleToken, setupOrganization, leaveOrganization, logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
