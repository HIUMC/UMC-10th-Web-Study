import { useParams } from "react-router-dom";
import { FiEdit2, FiHeart, FiTrash2 } from "react-icons/fi";
import CommentSection from "../components/CommentSection";
import { ErrorState, LoadingState } from "../components/FetchState";
import LpRecord from "../components/LpRecord";
import { useGetLpDetail } from "../hooks/useGetLpDetail";

const formatRelativeDate = (dateString?: string) => {
  if (!dateString) return "";

  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "오늘";
  if (diffDays < 30) return `${diffDays}일 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
};

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const { data: lp, isPending, isError, refetch } = useGetLpDetail(lpid || "");

  const likeCount = lp?.likes.length ?? 0;

  if (isPending) {
    return <LoadingState variant="detail" />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="relative min-h-full pb-12 w-full max-w-5xl mx-auto">
      <article className="w-full rounded-2xl bg-white p-7 shadow-sm dark:bg-[#272930] md:p-12">
        <header className="mb-10 flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
              <img
                src={
                  lp?.author.avatar ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${lp?.authorId}`
                }
                alt={lp?.author.name}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {lp?.author.name}
            </span>
          </div>

          <div className="flex flex-col items-end gap-12">
            <time className="text-sm font-medium text-slate-500 dark:text-gray-300">
              {formatRelativeDate(lp?.createdAt)}
            </time>
            <div className="flex items-center gap-4 text-slate-600 dark:text-gray-100">
              <button
                type="button"
                aria-label="LP 수정"
                className="transition-colors hover:text-pink-500"
              >
                <FiEdit2 size={20} />
              </button>
              <button
                type="button"
                aria-label="LP 삭제"
                className="transition-colors hover:text-red-500"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        </header>

        <section className="mb-10">
          <h1 className="break-words text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            {lp?.title}
          </h1>
        </section>

        <section className="mb-8">
          <LpRecord thumbnail={lp?.thumbnail} title={lp?.title} />
        </section>

        <section className="mx-auto mb-10 max-w-3xl">
          <p className="whitespace-pre-wrap break-words text-base leading-relaxed text-slate-700 dark:text-gray-100">
            {lp?.content}
          </p>
        </section>

        {lp?.tags.length ? (
          <section className="mb-8 flex flex-wrap justify-center gap-3">
            {lp.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-600 dark:text-white"
              >
                # {tag.name}
              </span>
            ))}
          </section>
        ) : null}

        <section className="flex justify-center">
          <button
            type="button"
            className="flex items-center gap-2 text-2xl font-semibold text-slate-800 transition-colors hover:text-pink-500 dark:text-white"
          >
            <FiHeart className="fill-pink-400 text-pink-400" size={34} />
            <span>{likeCount}</span>
          </button>
        </section>
      </article>

      {lpid && <CommentSection lpId={lpid} />}
    </div>
  );
};

export default LpDetailPage;
