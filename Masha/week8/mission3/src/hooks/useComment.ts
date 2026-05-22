import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment } from "../apis/comment";

export const useCreateComment = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lpComments", lpId],
      });
    },
  });
};

export const useDeleteComment = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lpComments", lpId],
      });
    },
  });
};