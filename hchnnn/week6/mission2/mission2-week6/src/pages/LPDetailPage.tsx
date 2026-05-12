import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchLpDetail, fetchLpComments, LpCard } from '../hooks/api';
import { useAuth } from '../hooks/useAuth';

export default function LPDetailPage() {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [order, setOrder] = useState<'latest' | 'oldest'>('latest');
  const [commentText, setCommentText] = useState('');
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.user) {
      const confirmed = window.confirm('상세 페이지는 로그인 후 접근 가능합니다. 로그인 페이지로 이동하시겠습니까?');
      if (confirmed) {
        navigate('/login', { state: { from: location.pathname } });
      } else {
        navigate('/v1/lps');
      }
    }
  }, [auth.user, location.pathname, navigate]);

  const id = typeof lpid === 'string' ? Number(lpid) : NaN;
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allComments = commentsData?.pages.flatMap(page => page.data) || [];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    // In a real app, this would submit the comment
    alert('댓글 기능은 아직 구현되지 않았습니다.');
    setCommentText('');
  };

  if (!auth.user) {
    return null;
  }

  return (
    <section className="page-section detail-page">
      <div className="page-heading">
        <h1>LP 상세</h1>
      </div>

      {isLoading ? (
        <div className="detail-loading">상세 정보를 불러오는 중입니다...</div>
      ) : isError ? (
        <div className="error-block">
          <p>{(error as Error)?.message || '상세 정보를 불러오는 데 실패했습니다.'}</p>
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
                <span>❤ {data.likes}</span>
              </div>
            </div>
            <p>{data.body}</p>
            <div className="detail-actions">
              <button type="button">수정</button>
              <button type="button">삭제</button>
              <button type="button">좋아요</button>
            </div>
          </div>
        </article>
      ) : null}

      {/* Comments Section */}
      <div className="comments-section">
        <div className="comments-header">
          <h3>댓글</h3>
          <div className="sort-group">
            <button
              type="button"
              className={order === 'latest' ? 'active' : ''}
              onClick={() => setOrder('latest')}
            >
              최신순
            </button>
            <button
              type="button"
              className={order === 'oldest' ? 'active' : ''}
              onClick={() => setOrder('oldest')}
            >
              오래된순
            </button>
          </div>
        </div>

        {/* Comment Form */}
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <div className="form-group">
            <label htmlFor="comment">댓글 작성</label>
            <textarea
              id="comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
              required
            />
            <div className="form-actions">
              <button type="submit" disabled={!commentText.trim()}>
                작성하기
              </button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="comments-list">
          {commentsLoading && (
            <>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="comment-skeleton">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line long" />
                </div>
              ))}
            </>
          )}

          {allComments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.name}</strong>
                <span>{comment.email}</span>
              </div>
              <p>{comment.body}</p>
            </div>
          ))}

          {isFetchingNextPage && (
            <>
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={`next-${idx}`} className="comment-skeleton">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line long" />
                </div>
              ))}
            </>
          )}
        </div>

        {commentsError && (
          <div className="error-block">
            <p>{(commentsErr as Error)?.message || '댓글을 불러오는 데 실패했습니다.'}</p>
          </div>
        )}

        <div ref={observerRef} style={{ height: '20px' }} />
      </div>
    </section>
  );
}