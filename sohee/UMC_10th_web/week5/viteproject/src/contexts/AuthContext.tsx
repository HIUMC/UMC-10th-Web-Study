import React, { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContextType';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const AUTH_EMAIL_KEY = 'authUserEmail';

  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_EMAIL_KEY);
  });

  const isAuthenticated = Boolean(userEmail);

  const login = (email: string, _password: string) => {
    void _password;
    localStorage.setItem(AUTH_EMAIL_KEY, email);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_EMAIL_KEY);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};