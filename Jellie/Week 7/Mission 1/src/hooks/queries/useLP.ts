import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createLP,
  createLPComment,
  deleteLP,
  deleteLPComment,
  getLPComments,
  getLPDetail,
  getLPs,
  likeLP,
  unlikeLP,
  updateLP,
  updateLPComment,
  type CreateLPRequest,
  type CreateCommentRequest,
  type UpdateCommentRequest,
  type UpdateLPRequest,
} from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import type {
  CommentListResponse,
  LPDetailResponse,
  LPListResponse,
} from "../../types/lp";
import { QUERY_KEY } from "../../constants/key";

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
  paginationDto: PaginationDto,
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

export const useCreateLP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateLPRequest) => createLP(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
};

export const useUpdateLP = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateLPRequest) => updateLP(lpId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, String(lpId)] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
};

export const useDeleteLP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: number) => deleteLP(lpId),
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, String(lpId)] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
};

export const useLikeLP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: number) => likeLP(lpId),
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, String(lpId)] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
};

export const useUnlikeLP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: number) => unlikeLP(lpId),
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, String(lpId)] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
};

export const useCreateLPComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCommentRequest) => createLPComment(lpId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, String(lpId)],
      });
    },
  });
};

export const useUpdateLPComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      body,
    }: {
      commentId: number;
      body: UpdateCommentRequest;
    }) => updateLPComment(lpId, commentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, String(lpId)],
      });
    },
  });
};

export const useDeleteLPComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteLPComment(lpId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, String(lpId)],
      });
    },
  });
};