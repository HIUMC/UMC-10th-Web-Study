import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getLps } from '../apis/lp';
import type { LP, SortType } from '../types/lp';

import LpCard from '../components/LpCard';
import LpSkeleton from '../components/LpSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import useDebounce from '../hooks/useDebounce';

const LpListPage = () => {
  const [sort, setSort] = useState<SortType>('desc');
  const [searchKeyword, setSearchKeyword] = useState('');
  const observerRef = useRef<HTMLDivElement | null>(null);

  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const trimmedKeyword = debouncedKeyword.trim();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['search', trimmedKeyword, sort],
    queryFn: ({ pageParam }) =>
      getLps({
        cursor: pageParam,
        sort,
        search: trimmedKeyword,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { nextCursor, hasNext } = lastPage.data;

      if (!hasNext || nextCursor === null) {
        return undefined;
      }

      return nextCursor;
    },
    enabled: trimmedKeyword.length > 0,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  const lps: LP[] = data?.pages.flatMap((page) => page.data.data) ?? [];

  const handleSortChange = (nextSort: SortType) => {
    setSort(nextSort);
  };

  useEffect(() => {
    if (!observerRef.current) return;
    if (!hasNextPage) return;
    if (trimmedKeyword.length === 0) return;

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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, trimmedKeyword]);

  if (isError) {
    return <ErrorMessage onRetry={() => void refetch()} />;
  }

  return (
    <section className="lp-list-page">
      <div className="lp-search-area">
        <div className="lp-search-row">
          <input
            className="lp-search-input"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            placeholder="LP 제목을 검색해보세요"
          />

          <button className="lp-search-button" type="button">
            검색
          </button>
        </div>

        <div className="sort-buttons">
          <button
            className={sort === 'asc' ? 'active' : ''}
            onClick={() => handleSortChange('asc')}
          >
            오래된순
          </button>

          <button
            className={sort === 'desc' ? 'active' : ''}
            onClick={() => handleSortChange('desc')}
          >
            최신순
          </button>
        </div>
      </div>

      {trimmedKeyword.length === 0 && (
        <p className="lp-search-guide">
          검색어를 입력하면 LP 목록을 조회합니다.
        </p>
      )}

      <div className="lp-grid">
        {isLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <LpSkeleton key={`lp-skeleton-${index}`} />
          ))}

        {!isLoading &&
          trimmedKeyword.length > 0 &&
          lps.length === 0 && (
            <p className="lp-empty-text">검색 결과가 없습니다.</p>
          )}

        {lps.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}

        {isFetchingNextPage &&
          Array.from({ length: 5 }).map((_, index) => (
            <LpSkeleton key={`next-lp-skeleton-${index}`} />
          ))}
      </div>

      <div ref={observerRef} style={{ height: '20px' }} />
    </section>
  );
};

export default LpListPage;