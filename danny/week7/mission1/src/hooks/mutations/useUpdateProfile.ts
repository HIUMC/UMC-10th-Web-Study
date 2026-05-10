import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, type UpdateProfilePayload } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
    onError: (error) => {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다.");
    },
  });
};
