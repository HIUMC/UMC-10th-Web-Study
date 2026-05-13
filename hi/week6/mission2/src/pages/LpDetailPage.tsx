import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getLpComments, getLpDetail } from '../apis/lp';
import type { SortType } from '../types/lp';

import LpSkeleton from '../components/LpSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import CommentSkeleton from '../components/CommentSkeleton';

import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/delete.svg';
import heartIcon from '../assets/heart.svg';

const LpDetailPage = () => {
  const params = useParams();

  const lpId = params.LPId ?? params.lpId ?? params.lpid ?? params.id;

  const [order, setOrder] = useState<SortType>('desc');
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: lp,
    isLoading: isLpLoading,
    isError: isLpError,
    refetch: refetchLp,
  } = useQuery({
    queryKey: ['lpDetail', lpId],
    queryFn: () => getLpDetail(lpId as string),
    enabled: !!lpId,
  });

  const {
    data: commentData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    refetch: refetchComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam }) =>
      getLpComments({
        lpId: lpId as string,
        cursor: pageParam,
        order,
      }),
    initialPageParam: 0,
    enabled: !!lpId,
    getNextPageParam: (lastPage) => {
      const { nextCursor, hasNext } = lastPage.data;

      if (!hasNext || nextCursor === null) {
        return undefined;
      }

      return nextCursor;
    },
  });

  const comments = commentData?.pages.flatMap((page) => page.data.data) ?? [];

  useEffect(() => {
    if (!observerRef.current) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];

      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!lpId) {
    return (
      <section className="lp-detail-page">
        <p>LP ID를 찾을 수 없습니다.</p>
      </section>
    );
  }

  if (isLpLoading) {
    return (
      <section className="lp-detail-page">
        <article className="lp-detail-card detail-loading">
          <LpSkeleton />
        </article>
      </section>
    );
  }

  if (isLpError || !lp) {
    return <ErrorMessage onRetry={() => void refetchLp()} />;
  }

  return (
    <section className="lp-detail-page">
      <article className="lp-detail-card">
        <div className="detail-top">
          <div className="detail-title-area">
            <div className="detail-author-row">
              <div className="detail-author-profile">
                <div className="detail-author-avatar">
                  {lp.authorId}
                </div>

                <span className="detail-author-name">
                  작성자 ID: {lp.authorId}
                </span>
              </div>

              <p className="detail-date">
                {new Date(lp.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="detail-title-row">
              <h1>{lp.title}</h1>

              <div className="detail-actions">
                <button type="button" className="detail-icon-button">
                  <img src={editIcon} alt="수정" />
                </button>

                <button type="button" className="detail-icon-button">
                  <img src={deleteIcon} alt="삭제" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-image-wrap">
          <img src={lp.thumbnail} alt={lp.title} />
        </div>

        <p className="detail-content">{lp.content}</p>

        {lp.tags.length > 0 && (
          <div className="detail-tags">
            {lp.tags.map((tag) => (
              <span key={tag.id}>#{tag.name}</span>
            ))}
          </div>
        )}

        <div className="detail-like">
          <button type="button" className="like-icon-button">
            <img src={heartIcon} alt="좋아요" />
          </button>

          <span>{lp.likes.length}</span>
        </div>
      </article>

      <section className="comment-card">
        <div className="comment-card-header">
          <h2>댓글</h2>

          <div className="comment-sort-buttons">
            <button
              type="button"
              className={order === 'asc' ? 'active' : ''}
              onClick={() => setOrder('asc')}
            >
              오래된순
            </button>

            <button
              type="button"
              className={order === 'desc' ? 'active' : ''}
              onClick={() => setOrder('desc')}
            >
              최신순
            </button>
          </div>
        </div>

        <div className="comment-form">
          <input
            type="text"
            placeholder="댓글을 입력해주세요"
            className="comment-input"
          />

          <button type="button" className="comment-submit-button">
            작성
          </button>
        </div>

        <p className="comment-guide">
          댓글 작성 기능은 추후 구현 예정입니다.
        </p>

        <div className="comment-list">
          {isCommentsLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <CommentSkeleton key={`comment-loading-${index}`} />
            ))}

          {isCommentsError && (
            <ErrorMessage onRetry={() => void refetchComments()} />
          )}

          {!isCommentsLoading &&
            comments.map((comment, index) => (
              <div className="comment-item" key={comment.id ?? index}>
                <div className="comment-profile">
                  {comment.author?.name?.[0] ??
                    comment.user?.name?.[0] ??
                    '김'}
                </div>

                <div className="comment-body">
                  <strong className="comment-author">
                    {comment.author?.name ??
                      comment.user?.name ??
                      '연진김'}
                  </strong>

                  <p className="comment-content">
                    {comment.content ?? '댓글 내용입니다.'}
                  </p>
                </div>

                <button type="button" className="comment-more-button">
                  ⋮
                </button>
              </div>
            ))}

          {isFetchingNextPage &&
            Array.from({ length: 5 }).map((_, index) => (
              <CommentSkeleton key={`comment-next-${index}`} />
            ))}
        </div>

        <div ref={observerRef} className="comment-observer" />
      </section>
    </section>
  );
};

export default LpDetailPage;