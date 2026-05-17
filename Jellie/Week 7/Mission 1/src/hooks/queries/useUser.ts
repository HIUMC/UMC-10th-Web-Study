import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMyInfo,
  getMyInfo,
  signOut,
  updateMyInfo,
  type UpdateUserRequest,
} from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../context/AuthContext";

type User = {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatar: string;
};

type MyInfoResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: User;
};

export const useMyInfo = () => {
  const { accessToken } = useAuth();

  return useQuery<MyInfoResponse>({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useUpdateMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateUserRequest) => updateMyInfo(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
};

export const useSignOut = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: signOut,
    onSuccess: logout,
    onError: logout,
  });
};

export const useDeleteMyInfo = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: deleteMyInfo,
    onSuccess: logout,
  });
};