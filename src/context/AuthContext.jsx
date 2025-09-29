import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.baseURL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      const loggedInUser = {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
      };

      setUser(loggedInUser);
      setToken(data.data.token);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      return { success: true, user: loggedInUser };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.baseURL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await response.json();
       if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      return { success: true, message: data.message };
    } catch (err)      {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  const resendVerificationEmail = async (email) => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(`${config.baseURL}/email/resend-verification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to resend verification email.');
        }
        return { success: true, message: data.message };
    } catch (err) {
        setError(err.message);
        return { success: false, message: err.message };
    } finally {
        setLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    resendVerificationEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};