import { type PropsWithChildren, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { postLogout, postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { RequestSigninDto } from "../types/auth";
import { AuthContext } from "./AuthContext";

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
    try {
      const tokenPayload = await postSignin(signinData);

      if (!tokenPayload.accessToken || !tokenPayload.refreshToken) {
        toast.error("로그인 응답이 올바르지 않습니다.");
        return false;
      }

      setAccessTokenInStorage(tokenPayload.accessToken);
      setRefreshTokenInStorage(tokenPayload.refreshToken);
      setAccessToken(tokenPayload.accessToken);
      setRefreshToken(tokenPayload.refreshToken);

      toast.success("로그인 성공");
      return true;
    } catch (error) {
      console.log("로그인 오류", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "이메일이나 비밀번호를 다시 확인해주세요.",
        );
        return false;
      }

      toast.error("로그인 중 오류가 발생했습니다.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await postLogout();
    } catch (error) {
      console.log("로그아웃 오류", error);
    } finally {
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);

      toast.success("로그아웃 성공");
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, accessToken, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
