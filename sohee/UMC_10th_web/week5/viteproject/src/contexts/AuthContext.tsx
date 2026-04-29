import React, { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContextType';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 초기 상태를 localStorage에서 가져옴
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('token');
    return token ? true : false;
  });

  const login = (token: string) => {
    // 실제로는 토큰을 로컬 스토리지에 저장하고 검증하는 로직이 들어감
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // useEffect 제거 - 초기 상태에서 처리

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};