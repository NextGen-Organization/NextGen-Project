import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    if (accessToken && !user) {
      // fetch profile
      axios.get(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => setUser(res.data))
        .catch((err) => {
          // If token invalid, clear stored token
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            setAccessToken(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
          setUser(null);
        });
    }
  }, [accessToken]);

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/login`, { email, password });
    setAccessToken(res.data.accessToken);
    localStorage.setItem('accessToken', res.data.accessToken);
    // store refresh token in localStorage for demo; recommend httpOnly cookie in production
    localStorage.setItem('refreshToken', res.data.refreshToken);
    setUser(res.data.user);
    // return user so callers can redirect based on role
    return res.data.user;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const refresh = async () => {
    const token = localStorage.getItem('refreshToken');
    if (!token) throw new Error('No refresh token');
    const res = await axios.post(`${API_BASE}/refresh`, { token });
    setAccessToken(res.data.accessToken);
    localStorage.setItem('accessToken', res.data.accessToken);
    return res.data.accessToken;
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
