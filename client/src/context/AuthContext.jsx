import { createContext, useContext, useState, useEffect } from 'react';
import { auth as authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.me()
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const register = (name, email, password) => authApi.register(name, email, password);
  const verifyOtp = (otp) => authApi.verifyOtp(otp);
  const resendOtp = () => authApi.resendOtp();

  const refreshUser = () => {
    return authApi.me().then((res) => setUser(res.data.data.user)).catch(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, verifyOtp, resendOtp, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
