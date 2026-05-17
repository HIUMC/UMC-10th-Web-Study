import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getLps } from '../apis/lp';
import type { LP, SortType } from '../types/lp';

import LpCard from '../components/LpCard';
import LpSkeleton from '../components/LpSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const LpListPage = () => {
  const [sort, setSort] = useState<SortType>('desc');
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: ({ pageParam }) =>
      getLps({
        cursor: pageParam,
        sort,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { nextCursor, hasNext } = lastPage.data;

      if (!hasNext || nextCursor === null) {
        return undefined;
      }

      return nextCursor;
    },
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

  if (isError) {
    return <ErrorMessage onRetry={() => void refetch()} />;
  }

  return (
    <section className="lp-list-page">
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

      <div className="lp-grid">
        {isLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <LpSkeleton key={`lp-skeleton-${index}`} />
          ))}

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