import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeLp } from '../api/lp';

export const useToggleLike = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => likeLp(lpId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['lp', lpId] });

      const previousLp = queryClient.getQueryData<any>(['lp', lpId]);

      queryClient.setQueryData(['lp', lpId], (old: any) => {
        if (!old) return old;

        const currentIsLiked = old.isLiked ?? false;
        const currentLikeCount = old.likeCount ?? old.likes?.length ?? 0;

        return {
          ...old,
          isLiked: !currentIsLiked,
          likeCount: currentIsLiked
            ? Math.max(currentLikeCount - 1, 0)
            : currentLikeCount + 1,
        };
      });

      return { previousLp };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousLp) {
        queryClient.setQueryData(['lp', lpId], context.previousLp);
      }

      alert('좋아요 반영에 실패했습니다.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
      queryClient.invalidateQueries({ queryKey: ['myLikedLps'] });
    },
  });
};