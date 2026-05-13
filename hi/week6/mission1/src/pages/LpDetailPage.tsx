import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../apis/lp';
import ErrorMessage from '../components/ErrorMessage';
import LpSkeleton from '../components/LpSkeleton';

import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/delete.svg';
import heartIcon from '../assets/heart.svg';

const LpDetailPage = () => {
  const { lpid } = useParams();

  const {
    data: lp,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => getLpDetail(lpid!),
    enabled: !!lpid,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <LpSkeleton />;
  }

  if (isError || !lp) {
    return <ErrorMessage onRetry={() => refetch()} />;
  }

  const imageSrc = lp.thumbnail;
  const likeCount = lp.likes?.length ?? 0;

  return (
    <section className="lp-detail-page">
      <div className="lp-detail-card">
        <div className="detail-top">
          <div className="detail-title-area">
            <div className="detail-author-row">
              <div className="detail-author-profile">
                <span className="detail-author-avatar">💿</span>
                <span className="detail-author-name">
                  작성자 ID: {lp.authorId}
                </span>
              </div>

              <span className="detail-date">
                {new Date(lp.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="detail-title-row">
              <h1>{lp.title}</h1>

              <div className="detail-actions">
                <button
                  type="button"
                  className="detail-icon-button"
                  aria-label="수정"
                >
                  <img src={editIcon} alt="수정" />
                </button>

                <button
                  type="button"
                  className="detail-icon-button"
                  aria-label="삭제"
                >
                  <img src={deleteIcon} alt="삭제" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-image-wrap">
          <img src={imageSrc} alt={lp.title} />
        </div>

        <p className="detail-content">{lp.content}</p>

        <div className="detail-tags">
          {lp.tags?.map((tag) => (
            <span key={tag.id}># {tag.name}</span>
          ))}
        </div>

        <div className="detail-like">
          <button
            type="button"
            className="like-icon-button"
            aria-label="좋아요"
          >
            <img src={heartIcon} alt="좋아요" />
          </button>
          <span>{likeCount}</span>
        </div>
      </div>
    </section>
  );
};

export default LpDetailPage;