import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMyProfile } from '../apis/user';
import type { UpdateProfilePayload, User } from '../types/user';

interface UseUpdateProfileParams {
  onSuccessCallback?: () => void;
}

export const useUpdateProfile = ({
  onSuccessCallback,
}: UseUpdateProfileParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMyProfile(payload),

    onMutate: async (newProfile) => {
      await queryClient.cancelQueries({ queryKey: ['myInfo'] });

      const previousProfile = queryClient.getQueryData<User>(['myInfo']);

      queryClient.setQueryData<User>(['myInfo'], (old) => {
        if (!old) return old;

        return {
          ...old,
          name: newProfile.name,
          bio: newProfile.bio,
          avatar: newProfile.avatar ?? old.avatar,
        };
      });

      localStorage.setItem('name', newProfile.name);

      return { previousProfile };
    },

    onError: (_error, _newProfile, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData<User>(['myInfo'], context.previousProfile);
        localStorage.setItem('name', context.previousProfile.name);
      }

      alert('프로필 수정에 실패했습니다.');
    },

    onSuccess: () => {
      onSuccessCallback?.();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
    },
  });
};