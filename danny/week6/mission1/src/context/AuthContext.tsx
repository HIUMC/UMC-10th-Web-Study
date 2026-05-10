import {
  createContext,
  useContext,
  useState,
  useEffect,
  type PropsWithChildren,
} from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";
import { axiosInstance } from "../apis/axios";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  isLoading: boolean;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  userName: null,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
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

  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("userName"),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAndSetUserName = async () => {
      if (accessToken && !userName) {
        try {
          const { data } = await axiosInstance.get("/v1/users/me");
          const fetchedName = data.data?.nickname || data.data?.name || "회원";

          setUserName(fetchedName);
          localStorage.setItem("userName", fetchedName);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchAndSetUserName();
  }, [accessToken, userName]);

  const login = async (signinData: RequestSigninDto) => {
    setIsLoading(true);
    try {
      const { data } = await postSignin(signinData);

      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;
        const fetchedName = data.name || data.name || "회원";

        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);
        localStorage.setItem("userName", fetchedName);

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUserName(fetchedName);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await postLogout();
    } catch (error) {
      console.error(error);
    } finally {
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      localStorage.removeItem("userName");

      setAccessToken(null);
      setRefreshToken(null);
      setUserName(null);
      setIsLoading(false);
      alert("로그아웃 되었습니다.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, userName, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }
  return context;
};
