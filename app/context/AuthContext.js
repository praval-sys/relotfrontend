// app/auth/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter,usePathname } from 'next/navigation';
import api from '../lib/api';
import path from 'path';

const AuthContext = createContext({});

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password','/','/products'];


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();


  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
        // Skip auth check for public routes
      if (PUBLIC_ROUTES.includes(pathname)) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('v1/user/');
        setUser(response.data);
        if (!PUBLIC_ROUTES.includes(pathname)) {
            router.push('/');
          }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { id, name, email } = response.data;
      
      setUser({ id, name, email });
      console.log(id, name, email);
      console.log('Login successful:', response.data);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      router.push('/login');
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);