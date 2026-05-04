import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLPDetail,
  getLPs,
  likeLP,
  unlikeLP,
  updateLP,
  type UpdateLPRequest,
} from "../../apis/lp";
import type { CursorBasedResponse, PaginationDto } from "../../types/common";
import type { LP, LPDetailResponse } from "../../types/lp";
import { QUERY_KEY } from "../../constants/key";

export const useLPList = (paginationDto: PaginationDto) => {
  return useQuery<LPListResponse, Error, CursorBasedResponse<LP>>({
    queryKey: [QUERY_KEY.lps, paginationDto],
    queryFn: () => getLPs(paginationDto),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useLPDetail = (lpId?: string) => {
  return useQuery<LPDetailResponse>({
    queryKey: [QUERY_KEY.lp, lpId],
    queryFn: () => getLPDetail(lpId as string),
    enabled: !!lpId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useLikeLP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: number) => likeLP(lpId),
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lp, String(lpId)],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
};

export const useUnlikeLP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: number) => unlikeLP(lpId),
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lp, String(lpId)],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
};

export const useUpdateLP = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateLPRequest) => updateLP(lpId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lp, String(lpId)],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
};