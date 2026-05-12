import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../apis/user';
import type { UpdateProfilePayload } from '../types/user';

interface UseUpdateProfileParams {
  onSuccessCallback?: () => void;
}

export const useUpdateProfile = ({
  onSuccessCallback,
}: UseUpdateProfileParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      onSuccessCallback?.();
    },
    onError: () => {
      alert('프로필 수정에 실패했습니다.');
    },
  });
};