import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchLpList } from '../hooks/api';
import { useDebounce } from '../hooks/useDebounce';
import SkeletonCard from '../components/SkeletonCard';

export default function LPListPage() {
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const trimmedDebouncedQuery = debouncedQuery.trim();
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['search', trimmedDebouncedQuery, sort],
    queryFn: ({ pageParam }) => searchLpList(sort, trimmedDebouncedQuery, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: trimmedDebouncedQuery.length > 0,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
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
  const hasSearchQuery = trimmedDebouncedQuery.length > 0;

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <h1>LP 목록</h1>
          <p>검색어 입력이 멈춘 뒤에만 API 요청이 실행됩니다.</p>
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

      <label className="search-field">
        <span>LP 검색</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="제목, 내용, 작성자 이름으로 검색"
        />
      </label>

      {!hasSearchQuery && (
        <div className="info-block">
          <p>검색어를 입력하면 300ms 뒤에 검색 요청이 실행됩니다.</p>
        </div>
      )}

      <div className="card-grid">
        {hasSearchQuery && isLoading && Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)}

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

        {hasSearchQuery && !isLoading && allItems.length === 0 && (
          <div className="info-block">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}

        {hasSearchQuery &&
          isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={`next-${idx}`} />)}
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
