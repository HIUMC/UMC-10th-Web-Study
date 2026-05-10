import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, type UpdateProfilePayload } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),

    onMutate: async (newProfile: UpdateProfilePayload) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      const previousProfile = queryClient.getQueryData([QUERY_KEY.myInfo]);

      queryClient.setQueryData([QUERY_KEY.myInfo], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            ...newProfile,
          },
        };
      });

      return { previousProfile };
    },

    onError: (error, newProfile, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousProfile);
      }
      console.error(error);
      alert("프로필 수정에 실패했습니다.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
};
