import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createComment,
  deleteComment,
  deleteLpPost,
  fetchLpComments,
  fetchLpDetail,
  LpCard,
  LpComment,
  toggleLpLike,
  updateComment,
} from '../hooks/api';
import { useAuth } from '../hooks/useAuth';
import { LpPostModal } from '../components/LpPostModal';

export default function LPDetailPage() {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<'latest' | 'oldest'>('latest');
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState<LpComment | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const id = typeof lpid === 'string' ? Number(lpid) : NaN;

  useEffect(() => {
    if (!auth.user) {
      navigate('/login', { state: { from: location.pathname }, replace: true });
    }
  }, [auth.user, location.pathname, navigate]);

  const { data, isLoading, isError, error, refetch } = useQuery<LpCard, Error>({
    queryKey: ['lp', id],
    queryFn: () => fetchLpDetail(id),
    enabled: auth.user !== null && !Number.isNaN(id),
    staleTime: 10000,
  });

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
    error: commentsErr,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lpComments', id, order],
    queryFn: ({ pageParam }: { pageParam: number }) => fetchLpComments(id, order, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: auth.user !== null && !Number.isNaN(id),
    staleTime: 10000,
  });

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: ['lpComments', id] });
  };

  const createCommentMutation = useMutation({
    mutationFn: (body: string) => createComment(id, body, auth.user?.nickname ?? 'me'),
    onSuccess: () => {
      setCommentText('');
      invalidateComments();
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, body }: { commentId: number; body: string }) => updateComment(id, commentId, body),
    onSuccess: () => {
      setEditingComment(null);
      setEditCommentText('');
      invalidateComments();
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(id, commentId),
    onSuccess: () => {
      setOpenMenuId(null);
      invalidateComments();
    },
  });

  const deleteLpMutation = useMutation({
    mutationFn: () => deleteLpPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      navigate('/v1/lps', { replace: true });
    },
  });

  const getOptimisticLikedLp = (lp: LpCard): LpCard => ({
    ...lp,
    likedByMe: !lp.likedByMe,
    likes: lp.likedByMe ? Math.max(0, lp.likes - 1) : lp.likes + 1,
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLpLike(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['lp', id] });
      await queryClient.cancelQueries({ queryKey: ['lps'] });

      const previousLp = queryClient.getQueryData<LpCard>(['lp', id]);
      const previousLpLists = queryClient.getQueriesData<InfiniteData<{ data: LpCard[]; nextPage?: number }>>({
        queryKey: ['lps'],
      });

      if (previousLp) {
        queryClient.setQueryData<LpCard>(['lp', id], getOptimisticLikedLp(previousLp));
      }

      queryClient.setQueriesData<InfiniteData<{ data: LpCard[]; nextPage?: number }>>({ queryKey: ['lps'] }, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((lp) => (lp.id === id ? getOptimisticLikedLp(lp) : lp)),
          })),
        };
      });

      return { previousLp, previousLpLists };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousLp) {
        queryClient.setQueryData(['lp', id], context.previousLp);
      }

      context?.previousLpLists.forEach(([queryKey, previousData]) => {
        queryClient.setQueryData(queryKey, previousData);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', id] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!auth.user) return null;

  const allComments = commentsData?.pages.flatMap((page) => page.data) || [];

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    createCommentMutation.mutate(commentText.trim());
  };

  const startEditComment = (comment: LpComment) => {
    setEditingComment(comment);
    setEditCommentText(comment.body);
    setOpenMenuId(null);
  };

  return (
    <section className="page-section detail-page">
      <div className="page-heading">
        <h1>LP 상세</h1>
      </div>

      {isLoading ? (
        <div className="detail-loading">상세 정보를 불러오는 중입니다...</div>
      ) : isError ? (
        <div className="error-block">
          <p>{error.message || '상세 정보를 불러오지 못했습니다.'}</p>
          <button type="button" onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      ) : data ? (
        <article className="detail-card">
          <img className="detail-thumb" src={data.thumbnail} alt={data.title} />
          <div className="detail-body">
            <div className="detail-header">
              <div>
                <span className="badge">LP 상세</span>
                <h2>{data.title}</h2>
              </div>
              <div className="detail-meta">
                <span>{data.uploadDate}</span>
                <span>좋아요 {data.likes}</span>
              </div>
            </div>
            <p>{data.body}</p>
            <div className="tag-list">
              {data.tags.map((tag) => (
                <span className="tag-chip readonly" key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
            <div className="detail-actions">
              <button type="button" onClick={() => setEditModalOpen(true)}>
                수정
              </button>
              <button type="button" className="danger-button" onClick={() => deleteLpMutation.mutate()}>
                삭제
              </button>
              <button type="button" onClick={() => likeMutation.mutate()} disabled={likeMutation.isPending}>
                {data.likedByMe ? '좋아요 취소' : '좋아요'}
              </button>
            </div>
          </div>
          <LpPostModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            user={auth.user}
            mode="edit"
            lp={data}
          />
        </article>
      ) : null}

      <div className="comments-section">
        <div className="comments-header">
          <h3>댓글</h3>
          <div className="sort-group">
            <button type="button" className={order === 'latest' ? 'active' : ''} onClick={() => setOrder('latest')}>
              최신순
            </button>
            <button type="button" className={order === 'oldest' ? 'active' : ''} onClick={() => setOrder('oldest')}>
              오래된순
            </button>
          </div>
        </div>

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <div className="form-group">
            <label htmlFor="comment">댓글 작성</label>
            <textarea
              id="comment"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="댓글을 입력하세요"
              rows={3}
              required
            />
            <div className="form-actions">
              <button type="submit" disabled={createCommentMutation.isPending || !commentText.trim()}>
                {createCommentMutation.isPending ? '작성 중...' : '작성하기'}
              </button>
            </div>
          </div>
        </form>

        <div className="comments-list">
          {commentsLoading &&
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="comment-skeleton">
                <div className="skeleton-line short" />
                <div className="skeleton-line long" />
              </div>
            ))}

          {allComments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div>
                  <strong>{comment.name}</strong>
                  <span>{comment.email}</span>
                </div>
                {comment.mine && (
                  <div className="comment-menu">
                    <button type="button" className="menu-button" onClick={() => setOpenMenuId(comment.id)}>
                      ...
                    </button>
                    {openMenuId === comment.id && (
                      <div className="menu-popover">
                        <button type="button" onClick={() => startEditComment(comment)}>
                          수정
                        </button>
                        <button type="button" onClick={() => deleteCommentMutation.mutate(comment.id)}>
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {editingComment?.id === comment.id ? (
                <form
                  className="comment-edit-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!editCommentText.trim()) return;
                    updateCommentMutation.mutate({ commentId: comment.id, body: editCommentText.trim() });
                  }}
                >
                  <textarea value={editCommentText} onChange={(event) => setEditCommentText(event.target.value)} />
                  <div className="form-actions">
                    <button type="button" className="ghost-button" onClick={() => setEditingComment(null)}>
                      취소
                    </button>
                    <button type="submit" disabled={updateCommentMutation.isPending || !editCommentText.trim()}>
                      저장
                    </button>
                  </div>
                </form>
              ) : (
                <p>{comment.body}</p>
              )}
            </div>
          ))}

          {isFetchingNextPage &&
            Array.from({ length: 2 }).map((_, idx) => (
              <div key={`next-${idx}`} className="comment-skeleton">
                <div className="skeleton-line short" />
                <div className="skeleton-line long" />
              </div>
            ))}
        </div>

        {commentsError && (
          <div className="error-block">
            <p>{(commentsErr as Error)?.message || '댓글을 불러오지 못했습니다.'}</p>
          </div>
        )}

        <div ref={observerRef} style={{ height: '20px' }} />
      </div>
    </section>
  );
}
