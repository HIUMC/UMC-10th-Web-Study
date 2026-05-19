import { useState, type PropsWithChildren } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LOCAL_STORAGE_KEY, QUERY_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { postLogout } from "../apis/auth";
import { AuthContext } from "./authContextValue";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const {
    getItem: getAccessTokenInStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenInStorage(),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage(),
  );

  const setAuthTokens = (newAccessToken: string, newRefreshToken: string) => {
    setAccessTokenInStorage(newAccessToken);
    setRefreshTokenInStorage(newRefreshToken);

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
  };

  const clearAuth = () => {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
    queryClient.removeQueries({ queryKey: [QUERY_KEY.myInfo] });

    setAccessToken(null);
    setRefreshToken(null);
  };

  const logout = async () => {
    try {
      await postLogout();
      clearAuth();
    } catch (error) {
      console.error("로그아웃 오류", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, setAuthTokens, clearAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
