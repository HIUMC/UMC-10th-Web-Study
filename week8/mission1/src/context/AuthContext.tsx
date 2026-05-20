import { useState, type PropsWithChildren } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, postLogout, postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { AuthContext } from "./authContextValue";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { RequestSigninDto } from "../types/auth";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
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

  const clearAuth = () => {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
    setAccessToken(null);
    setRefreshToken(null);
    queryClient.clear();
  };

  const loginMutation = useMutation({
    mutationFn: postSignin,
    onSuccess: (response) => {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      setAccessTokenInStorage(newAccessToken);
      setRefreshTokenInStorage(newRefreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: postLogout,
  });

  const withdrawMutation = useMutation({
    mutationFn: deleteUser,
  });

  const login = async (signinData: RequestSigninDto) => {
    try {
      await loginMutation.mutateAsync(signinData);
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      clearAuth();
    }
  };

  const withdraw = async () => {
    try {
      await withdrawMutation.mutateAsync();
      clearAuth();
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        login,
        logout,
        withdraw,
        isLoginPending: loginMutation.isPending,
        isLogoutPending: logoutMutation.isPending,
        isWithdrawPending: withdrawMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
