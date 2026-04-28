import { createContext, useContext, useState } from 'react'
import API from '../api/axios';

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('luxe_user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('accessToken') || null
  })

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      
      if (res.data.success) {
        const { accessToken, refreshToken, user: userData } = res.data;

        const finalUser = {
          ...userData,
          phone: userData.phone || '', 
          avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=2B3FE7&color=fff`,
          memberSince: userData.createdAt ? new Date(userData.createdAt).getFullYear() : '2024'
        };

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('luxe_user', JSON.stringify(finalUser));

        setToken(accessToken);
        setUser(finalUser);
        return res.data;
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const updateProfile = async (profileData) => {
    const res = await API.put('/auth/update-profile', profileData);
    if (res.data.success) {
      const updatedUser = { ...user, ...res.data.user };
      setUser(updatedUser);
      localStorage.setItem('luxe_user', JSON.stringify(updatedUser));
    }
    return res.data;
  };

  // Upload avatar — sends multipart/form-data
  const uploadAvatar = async (formData) => {
    const res = await API.post('/auth/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data.success) {
      const updatedUser = { ...user, avatar: res.data.avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('luxe_user', JSON.stringify(updatedUser));
    }
    return res.data;
  };

  const register = async (name, email, phone, password) => {
    try {
      const res = await API.post('/auth/register', { name, email, phone, password });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('luxe_user');
    setUser(null);
    setToken(null);
  };

  const isLoggedIn = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoggedIn, updateProfile, uploadAvatar }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}