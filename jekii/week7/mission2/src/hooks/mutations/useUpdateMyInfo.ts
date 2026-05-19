import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import type { RequestUpdateMyInfoDto, ResponseMyInfoDto } from "../../types/auth";

function useUpdateMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: RequestUpdateMyInfoDto) => patchMyInfo(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      const previousMyInfo = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);

      queryClient.setQueryData<ResponseMyInfoDto>(
        [QUERY_KEY.myInfo],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              name: body.name,
              bio: body.bio,
              avatar: body.avatar,
            },
          };
        },
      );

      return { previousMyInfo };
    },
    onError: (_error, _body, context) => {
      if (context?.previousMyInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousMyInfo);
      }
    },
    onSuccess: (response) => {
      queryClient.setQueryData([QUERY_KEY.myInfo], response);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}

export default useUpdateMyInfo;
