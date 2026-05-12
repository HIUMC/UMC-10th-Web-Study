import * as React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthUser = {
  nickname: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (nickname: string) => void;
  logout: () => void;
};

const storageKey = 'lp-auth-user';

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(storageKey);
  return stored ? (JSON.parse(stored) as AuthUser) : null;
}

function setStoredUser(user: AuthUser) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(user));
}

function clearStoredUser() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(storageKey);
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const login = (nickname: string) => {
    const authUser = { nickname };
    setStoredUser(authUser);
    setUser(authUser);
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
