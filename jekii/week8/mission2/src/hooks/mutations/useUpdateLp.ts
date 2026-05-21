import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestUpdateLpDto } from "../../types/lp";

type UpdateLpVariables = {
  lpId: string;
  body: RequestUpdateLpDto;
};

function useUpdateLp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, body }: UpdateLpVariables) => patchLp(lpId, body),
    onSuccess: (_, { lpId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
    },
  });
}

export default useUpdateLp;
