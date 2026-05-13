import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLps } from '../apis/lp';
import type { SortType } from '../types/lp';
import LpCard from '../components/LpCard';
import LpSkeleton from '../components/LpSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const LpListPage = () => {
  const [sort, setSort] = useState<SortType>('desc');

  const {
    data: lps = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['lps', sort],
    queryFn: () => getLps(sort),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  const handleSortChange = (nextSort: SortType) => {
    setSort(nextSort);
  };

  if (isLoading) {
    return <LpSkeleton />;
  }

  if (isError) {
    return <ErrorMessage onRetry={() => refetch()} />;
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
        {Array.isArray(lps) &&
          lps.map((lp) => (
           <LpCard key={lp.id} lp={lp} />
         ))}
      </div>
    </section>
  );
};

export default LpListPage;