import { useParams } from "react-router-dom";
import { ErrorBlock } from "../components/common/QueryStatus";
import { useGetLp } from "../hooks/queries/useGetLp";
import { formatTimeAgo } from "../utils/time";

const LpDetailPage = () => {
  const { lpid } = useParams();
  const id = Number(lpid);
  const { data, isPending, isError, refetch } = useGetLp(id);

  if (!Number.isFinite(id) || id <= 0) {
    return (
      <div className="p-6">
        <ErrorBlock message="잘못된 LP 주소입니다." />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
        <div className="rounded-2xl bg-gray-900 p-8">
          <div className="mx-auto aspect-square w-full max-w-md animate-pulse rounded-full bg-gray-800" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorBlock onRetry={() => refetch()} />
      </div>
    );
  }

  const lp = data!.data;
  const likeCount = Array.isArray(lp.likes) ? lp.likes.length : 0;

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
      <article className="rounded-2xl bg-gray-900 p-6 md:p-10">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {lp.author?.avatar ? (
              <img
                src={lp.author.avatar}
                alt={lp.author.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-emerald-500/70" />
            )}
            <span className="font-semibold text-white">
              {lp.author?.name ?? "익명"}
            </span>
          </div>
          <span className="text-sm text-gray-400">
            {formatTimeAgo(lp.createdAt)}
          </span>
        </header>

        <div className="mt-6 flex items-start justify-between gap-4">
          <h1 className="break-words text-2xl font-bold text-white md:text-3xl">
            {lp.title}
          </h1>
          <div className="flex shrink-0 gap-3 text-gray-300">
            <button
              type="button"
              aria-label="수정"
              className="cursor-pointer p-1 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 20h4l10-10-4-4L4 16v4z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="삭제"
              className="cursor-pointer p-1 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 7h14M10 11v6M14 11v6M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="relative aspect-square w-full max-w-md">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="h-full w-full rounded-full object-cover shadow-[0_0_60px_rgba(0,0,0,0.6)]"
            />
            <div className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-200 ring-4 ring-gray-900" />
          </div>
        </div>

        <p className="mt-8 whitespace-pre-wrap break-words text-center text-gray-200">
          {lp.content}
        </p>

        {lp.tags && lp.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {lp.tags.map((tag) => (
              <li
                key={tag.id}
                className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300"
              >
                # {tag.name}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="좋아요"
            className="cursor-pointer text-2xl text-pink-500 hover:scale-110 transition-transform"
          >
            ♥
          </button>
          <span className="text-white">{likeCount}</span>
        </div>
      </article>
    </div>
  );
};

export default LpDetailPage;
