import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { postLogout, postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { RequestSigninDto } from "../types/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
  clearTokens: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
  clearTokens: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage(),
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage(),
  );

  const login = async (signinData: RequestSigninDto) => {
    const { data } = await postSignin(signinData);

    if (data) {
      setAccessTokenInStorage(data.accessToken);
      setRefreshTokenInStorage(data.refreshToken);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    }
  };

  const logout = async () => {
    try {
      await postLogout();
    } catch {
      // 서버 로그아웃 실패해도 로컬 토큰은 제거
    } finally {
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
    }
  };

  const clearTokens = () => {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout, clearTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을수 없습니다.");
  }
  return context;
};
