import { useMutation } from "@tanstack/react-query";
import { login, logout, withdraw } from "../apis/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

export const useWithdraw = () => {
  return useMutation({
    mutationFn: withdraw,
  });
};