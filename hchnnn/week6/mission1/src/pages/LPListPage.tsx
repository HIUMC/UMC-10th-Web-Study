import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '../hooks/useQuery'; 
import { fetchLpList, LpCard } from '../hooks/api';

export default function LPListPage() {
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery<LpCard[]>({
    queryKey: ['lps', sort],
    queryFn: () => fetchLpList(sort),
    staleTime: 10000,
  });

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <h1>LP 목록</h1>
          <p>정렬 변경 시 자동으로 최신/오래된 순으로 다시 조회됩니다.</p>
        </div>
        <div className="sort-group">
          <button
            type="button"
            className={sort === 'latest' ? 'active' : ''}
            onClick={() => setSort('latest')}
          >
            최신순
          </button>
          <button
            type="button"
            className={sort === 'oldest' ? 'active' : ''}
            onClick={() => setSort('oldest')}
          >
            오래된순
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card-grid">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="card-skeleton">
              <div className="skeleton-image" />
              <div className="skeleton-line short" />
              <div className="skeleton-line long" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error-block">
          <p>{error || '데이터를 불러오는 데 실패했습니다.'}</p>
          <button type="button" onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {data?.map((item) => (
            <article
              key={item.id}
              className="lp-card"
              onClick={() => navigate(`/lp/${item.id}`)}
            >
              <div 
                className="card-thumb" 
                style={{ backgroundImage: `url(${item.thumbnail})` }} 
              />
              <div className="card-meta">
                <strong>{item.title}</strong>
                <span>{item.uploadDate}</span>
                <span>❤ {item.likes}</span>
              </div>
              <p>{item.body.slice(0, 80)}...</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}