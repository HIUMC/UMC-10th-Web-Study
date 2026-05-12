import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getLPComments,
  getLPDetail,
  getLPs,
  likeLP,
  unlikeLP,
  updateLP,
  type UpdateLPRequest,
} from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import type {
  CommentListResponse,
  LPDetailResponse,
  LPListResponse,
} from "../../types/lp";
import { QUERY_KEY } from "../../constants/key";
import { useMyInfo } from "./useUser";

export const useInfiniteLPList = (paginationDto: PaginationDto) => {
  return useInfiniteQuery<LPListResponse>({
    queryKey: [QUERY_KEY.lps, paginationDto.order, paginationDto.search],
    queryFn: ({ pageParam }) =>
      getLPs({
        ...paginationDto,
        cursor: pageParam as number | undefined,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.hasNext) return undefined;
      return lastPage.data.nextCursor ?? undefined;
    },
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

export const useInfiniteLPComments = (
  lpId: string | undefined,
  paginationDto: PaginationDto
) => {
  return useInfiniteQuery<CommentListResponse>({
    queryKey: [QUERY_KEY.lpComments, lpId, paginationDto.order],
    queryFn: ({ pageParam }) =>
      getLPComments(lpId as string, {
        ...paginationDto,
        cursor: pageParam as number | undefined,
      }),
    enabled: !!lpId,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.hasNext) return undefined;
      return lastPage.data.nextCursor ?? undefined;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });
};

export const useLikeLP = () => {
  const queryClient = useQueryClient();
  const { data: myInfo } = useMyInfo();

  return useMutation({
    mutationFn: (lpId: number) => likeLP(lpId),

    onMutate: async (lpId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lp, String(lpId)],
      });

      const previousLP = queryClient.getQueryData<LPDetailResponse>([
        QUERY_KEY.lp,
        String(lpId),
      ]);

      queryClient.setQueryData<LPDetailResponse>(
        [QUERY_KEY.lp, String(lpId)],
        (old) => {
          if (!old || !myInfo?.data) return old;

          const alreadyLiked = old.data.likes.some(
            (like) => like.userId === myInfo.data.id
          );

          if (alreadyLiked) return old;

          return {
            ...old,
            data: {
              ...old.data,
              likes: [
                ...old.data.likes,
                {
                  id: Date.now(),
                  userId: myInfo.data.id,
                  lpId,
                },
              ],
            },
          };
        }
      );

      return { previousLP };
    },

    onError: (_error, lpId, context) => {
      if (context?.previousLP) {
        queryClient.setQueryData(
          [QUERY_KEY.lp, String(lpId)],
          context.previousLP
        );
      }
    },

    onSettled: (_data, _error, lpId) => {
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
  const { data: myInfo } = useMyInfo();

  return useMutation({
    mutationFn: (lpId: number) => unlikeLP(lpId),

    onMutate: async (lpId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lp, String(lpId)],
      });

      const previousLP = queryClient.getQueryData<LPDetailResponse>([
        QUERY_KEY.lp,
        String(lpId),
      ]);

      queryClient.setQueryData<LPDetailResponse>(
        [QUERY_KEY.lp, String(lpId)],
        (old) => {
          if (!old || !myInfo?.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              likes: old.data.likes.filter(
                (like) => like.userId !== myInfo.data.id
              ),
            },
          };
        }
      );

      return { previousLP };
    },

    onError: (_error, lpId, context) => {
      if (context?.previousLP) {
        queryClient.setQueryData(
          [QUERY_KEY.lp, String(lpId)],
          context.previousLP
        );
      }
    },

    onSettled: (_data, _error, lpId) => {
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