import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useGetLpDetail } from '../hooks/useGetLpDetail';
import AuthModal from '../components/AuthModal';
import { getHttpErrorMessage } from '../utils/error';
import { getRelativeTime } from '../utils/time';
import { ErrorState, LoadingState } from '../components/AsyncState';

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  const { data: lp, isPending, isError, error, refetch } = useGetLpDetail(
    accessToken ? Number(lpid) : undefined
  );

  if (!accessToken) {
    return (
      <AuthModal
        onConfirm={() => navigate('/login', { state: { from: `/lp/${lpid}` } })}
        onCancel={() => navigate('/')}
      />
    );
  }

  if (isPending) {
    return <LoadingState />;
  }

  if (isError || !lp) {
    const { message, status } = getHttpErrorMessage(error);
    return (
      <ErrorState
        message={message}
        description={status === 404 ? '삭제되었거나 잘못된 주소일 수 있습니다.' : undefined}
        action={status !== 401 && (
          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-yellow-500 text-white rounded-full text-sm hover:bg-yellow-600"
          >
            다시 시도
          </button>
        )}
        secondaryAction={<button
          onClick={() => navigate('/')}
          className="px-5 py-2 border border-gray-600 text-gray-300 rounded-full text-sm hover:bg-gray-800"
        >
          목록으로 돌아가기
        </button>}
      />
    );
  }

  const isOwner = user?.id === lp.authorId;

  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col gap-5">
      {/* 저자 + 날짜 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">
            {lp.author?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-white text-sm font-medium">{lp.author?.name ?? '알 수 없음'}</span>
        </div>
        <span className="text-gray-500 text-sm">{getRelativeTime(lp.createdAt)}</span>
      </div>

      {/* 제목 + 수정/삭제 */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-white">{lp.title}</h1>
        {isOwner && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="수정"
            >
              {/* pencil icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              className="text-red-500 hover:text-red-400 transition-colors"
              aria-label="삭제"
            >
              {/* trash icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/>
                <path d="M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 원형 LP 썸네일 */}
      <div className="flex justify-center my-2">
        <div className="w-64 h-64 rounded-full overflow-hidden bg-gray-800 border-4 border-gray-700 shadow-xl">
          {lp.thumbnail ? (
            <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl">🎵</span>
            </div>
          )}
        </div>
      </div>

      {/* 본문 */}
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{lp.content}</p>

      {/* 태그 */}
      {lp.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {lp.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 bg-gray-800 text-yellow-400 text-xs rounded-full border border-gray-700"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* 좋아요 + 돌아가기 */}
      <div className="flex items-center justify-between pt-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-600 text-white text-sm hover:bg-gray-800 transition-colors">
          <span>♥</span>
          <span>{lp.likes.length}</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-gray-400 text-sm hover:text-white transition-colors"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}
