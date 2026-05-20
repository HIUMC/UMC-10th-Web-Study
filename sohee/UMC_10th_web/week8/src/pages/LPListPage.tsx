import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchLpList } from '../hooks/api';
import { useDebounce } from '../hooks/useDebounce';
import { useThrottle } from '../hooks/useThrottle';
import SkeletonCard from '../components/SkeletonCard';

export default function LPListPage() {
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [query, setQuery] = useState('');
  const [bottomSignal, setBottomSignal] = useState(0);
  const debouncedQuery = useDebounce(query, 300);
  const throttledBottomSignal = useThrottle(bottomSignal, 1000);
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
        if (entries[0].isIntersecting) {
          setBottomSignal(Date.now());
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!trimmedDebouncedQuery || throttledBottomSignal === 0 || !hasNextPage || isFetchingNextPage) {
      return;
    }

    console.log('throttled infinite scroll fetch', new Date().toLocaleTimeString());
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, throttledBottomSignal, trimmedDebouncedQuery]);

  const allItems = data?.pages.flatMap((page) => page.data) || [];
  const hasSearchQuery = trimmedDebouncedQuery.length > 0;

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <h1>LP List</h1>
          <p>Search requests wait for debounce, and infinite scroll fetches are throttled.</p>
        </div>
        <div className="sort-group">
          <button type="button" className={sort === 'latest' ? 'active' : ''} onClick={() => setSort('latest')}>
            Latest
          </button>
          <button type="button" className={sort === 'oldest' ? 'active' : ''} onClick={() => setSort('oldest')}>
            Oldest
          </button>
        </div>
      </div>

      <label className="search-field">
        <span>LP Search</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try typing typescript"
        />
      </label>

      {!hasSearchQuery && (
        <div className="info-block">
          <p>Type a search term. The API request starts 300ms after typing stops.</p>
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
                <span>Likes {item.likes}</span>
                <span>{item.author}</span>
              </div>
            </div>
          </article>
        ))}

        {hasSearchQuery && !isLoading && allItems.length === 0 && (
          <div className="info-block">
            <p>No results found.</p>
          </div>
        )}

        {hasSearchQuery &&
          isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={`next-${idx}`} />)}
      </div>

      {isError && (
        <div className="error-block">
          <p>{(error as Error)?.message || 'Failed to load data.'}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      <div ref={observerRef} style={{ height: '20px' }} />
    </section>
  );
}
