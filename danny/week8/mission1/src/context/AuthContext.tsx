import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface AuthContextValue {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogin: (accessToken: string, refreshToken: string) => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const handleLogin = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, accessToken);
    localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, refreshToken);
    setIsLoggedIn(true);
    setIsAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
    localStorage.removeItem("nickname");
    setIsLoggedIn(false);
    setIsAuthLoading(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (!accessToken) {
      setIsLoggedIn(false);
      setIsAuthLoading(false);
      return;
    }

    getMyInfo()
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        localStorage.removeItem("nickname");
        setIsLoggedIn(false);
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn,
      isAuthLoading,
      setIsLoggedIn,
      handleLogin,
      handleLogout,
    }),
    [isLoggedIn, isAuthLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
