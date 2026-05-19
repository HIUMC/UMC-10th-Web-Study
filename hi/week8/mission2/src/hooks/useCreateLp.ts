import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp } from '../apis/lp';
import type { CreateLpPayload } from '../types/lp';

interface UseCreateLpParams {
  onSuccessCallback?: () => void;
}

export const useCreateLp = ({ onSuccessCallback }: UseCreateLpParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLpPayload) => createLp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      onSuccessCallback?.();
    },
    onError: () => {
      alert('LP 생성에 실패했습니다.');
    },
  });
};