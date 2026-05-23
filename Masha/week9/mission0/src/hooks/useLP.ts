import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postLp, updateLp, deleteLp, getMyLps } from "../apis/lp";

export const useGetMyLps = () => {
  return useQuery({
    queryKey: ["myLps"],
    queryFn: getMyLps,
  });
};

export const usePostLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lps"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myLps"],
      });
    },
  });
};

export const useUpdateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lps"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myLps"],
      });
    },
  });
};

export const useDeleteLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lps"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myLps"],
      });
    },
  });
};