import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp, updateLp, deleteLp } from "../apis/lp";

export const usePostLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lps"],
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
    },
  });
};