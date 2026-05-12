import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLpDetail, LpCard } from '../hooks/api';
import { useAuth } from '../hooks/useAuth';

export default function LPDetailPage() {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

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
    </section>
  );
}