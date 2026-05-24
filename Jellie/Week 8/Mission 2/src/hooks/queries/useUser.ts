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

    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      const previousMyInfo = queryClient.getQueryData<MyInfoResponse>([
        QUERY_KEY.myInfo,
      ]);

      queryClient.setQueryData<MyInfoResponse>([QUERY_KEY.myInfo], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            ...body,
          },
        };
      });

      return { previousMyInfo };
    },

    onError: (_error, _body, context) => {
      if (context?.previousMyInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousMyInfo);
      }
    },

    onSettled: () => {
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