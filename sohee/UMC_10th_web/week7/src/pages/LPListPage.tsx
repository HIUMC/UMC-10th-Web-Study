import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLpList } from '../hooks/api';
import SkeletonCard from '../components/SkeletonCard';

export default function LPListPage() {
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: ({ pageParam }: { pageParam: number }) => fetchLpList(sort, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 10000,
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

  const allItems = data?.pages.flatMap((page) => page.data) || [];

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <h1>LP 목록</h1>
          <p>우측 하단 + 버튼으로 새 LP를 작성할 수 있습니다.</p>
        </div>
        <div className="sort-group">
          <button type="button" className={sort === 'latest' ? 'active' : ''} onClick={() => setSort('latest')}>
            최신순
          </button>
          <button type="button" className={sort === 'oldest' ? 'active' : ''} onClick={() => setSort('oldest')}>
            오래된순
          </button>
        </div>
      </div>

      <div className="card-grid">
        {isLoading && Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)}

        {allItems.map((item) => (
          <article key={item.id} className="lp-card" onClick={() => navigate(`/lp/${item.id}`)}>
            <div className="card-thumb" style={{ backgroundImage: `url(${item.thumbnail})` }} />
            <div className="card-content">
              <div className="card-meta">
                <strong>{item.title}</strong>
                <span>{item.uploadDate}</span>
              </div>
              <p>{item.body.slice(0, 80)}...</p>
              <div className="card-footer">
                <span>좋아요 {item.likes}</span>
                <span>{item.author}</span>
              </div>
            </div>
          </article>
        ))}

        {isFetchingNextPage && Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={`next-${idx}`} />)}
      </div>

      {isError && (
        <div className="error-block">
          <p>{(error as Error)?.message || '데이터를 불러오지 못했습니다.'}</p>
          <button type="button" onClick={() => window.location.reload()}>
            다시 시도
          </button>
        </div>
      )}

      <div ref={observerRef} style={{ height: '20px' }} />
    </section>
  );
}
