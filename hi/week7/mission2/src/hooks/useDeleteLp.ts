import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLp } from '../apis/lp';

export const useDeleteLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: string) => deleteLp(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
    },
    onError: () => {
      alert('LP 삭제에 실패했습니다.');
    },
  });
};