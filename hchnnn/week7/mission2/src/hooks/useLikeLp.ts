import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeLp } from '../api/lp';

export const useLikeLp = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => likeLp(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpDetail', lpId] });
    },
    onError: () => {
      alert('좋아요 처리에 실패했습니다.');
    },
  });
};