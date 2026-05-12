import { useEffect, useState, type FormEvent } from "react";
import { Heart, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import CommentSkeleton from "../components/CommentSkeleton";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import type { LpComment } from "../types/lps";

const COMMENT_PAGE_LIMIT = 10;
const COMMENT_SKELETON_COUNT = 10;

const getRelativeTime = (value: Date | string) => {
  const createdAt = new Date(value);
  const diff = Date.now() - createdAt.getTime();

  if (Number.isNaN(diff)) {
    return "";
  }

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (diff < minute) {
    return "방금 전";
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)}분 전`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}시간 전`;
  }

  if (diff < month) {
    return `${Math.floor(diff / day)}일 전`;
  }

  if (diff < year) {
    return `${Math.floor(diff / month)}개월 전`;
  }

  return `${Math.floor(diff / year)}년 전`;
};

const getAvatarClassName = (authorId: number) => {
  const colors = [
    "bg-pink-500 text-white",
    "bg-emerald-200 text-emerald-800",
    "bg-sky-300 text-sky-900",
    "bg-amber-200 text-amber-900",
    "bg-violet-300 text-violet-900",
  ];

  return colors[authorId % colors.length];
};

function CommentItem({ comment }: { comment: LpComment }) {
  const authorName = comment.author.name;

  return (
    <li className="flex items-start gap-3">
      {comment.author.avatar ? (
        <img
          src={comment.author.avatar}
          alt={authorName}
          className="mt-1 h-9 w-9 shrink-0 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className={[
            "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black",
            getAvatarClassName(comment.authorId),
          ].join(" ")}
        >
          {authorName.slice(0, 1)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-base font-bold text-white">
            {authorName}
          </p>
          <time className="shrink-0 text-xs font-medium text-zinc-400">
            {getRelativeTime(comment.createdAt)}
          </time>
        </div>
        <p className="mt-1 break-words text-sm font-medium leading-relaxed text-zinc-100">
          {comment.content}
        </p>
      </div>

      <button
        type="button"
        aria-label="댓글 더보기"
        className="mt-1 shrink-0 rounded-full p-1 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
      >
        <MoreVertical size={18} />
      </button>
    </li>
  );
}

function LpDetailPage() {
  const { lpid } = useParams();
  const lpId = Number(lpid);
  const isValidLpId = Number.isInteger(lpId) && lpId > 0;
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [commentContent, setCommentContent] = useState("");
  const {
    data: lpDetailData,
    isPending: isLpDetailPending,
    isError: isLpDetailError,
  } = useGetLpDetail(lpId);
  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: "240px",
  });
  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useGetLpComments({
    lpId,
    order,
    limit: COMMENT_PAGE_LIMIT,
  });

  const lp = lpDetailData?.data;
  const comments = commentData?.pages.flatMap((page) => page.data.data) ?? [];
  const trimmedComment = commentContent.trim();
  const commentSkeletons = Array.from(
    { length: COMMENT_SKELETON_COUNT },
    (_, index) => index,
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const sortButtonClass = (value: "asc" | "desc") =>
    [
      "h-9 min-w-20 rounded-md border px-4 text-sm font-bold transition-colors",
      order === value
        ? "border-white bg-white text-black"
        : "border-zinc-500 bg-transparent text-white hover:bg-zinc-700",
    ].join(" ");

  if (!isValidLpId) {
    return (
      <section className="flex min-h-full items-center justify-center bg-black px-6 py-10 text-white">
        <p className="text-sm font-semibold text-zinc-400">
          올바르지 않은 LP 주소입니다.
        </p>
      </section>
    );
  }

  if (isLpDetailPending) {
    return (
      <section className="flex min-h-full items-center justify-center bg-black px-6 py-10 text-white">
        <p className="text-sm font-semibold text-zinc-400">
          LP 상세 정보를 불러오는 중입니다.
        </p>
      </section>
    );
  }

  if (isLpDetailError || !lp) {
    return (
      <section className="flex min-h-full items-center justify-center bg-black px-6 py-10 text-white">
        <p className="text-sm font-semibold text-red-400">
          LP 상세 정보를 불러오지 못했습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-full bg-black px-5 py-9 text-white md:px-12 lg:px-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <article className="flex w-full flex-col rounded-2xl bg-[#282b33] px-6 py-8 shadow-xl shadow-black/35 sm:px-10 md:px-16">
          <header className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {lp.author.avatar ? (
                <img
                  src={lp.author.avatar}
                  alt={lp.author.name}
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-lg font-black text-emerald-700">
                  {lp.author.name.slice(0, 1)}
                </div>
              )}
              <p className="truncate text-2xl font-bold">{lp.author.name}</p>
            </div>

            <time className="shrink-0 pt-1 text-base font-medium text-white/90">
              {getRelativeTime(lp.createdAt)}
            </time>
          </header>

          <div className="mt-12 flex items-start justify-between gap-4">
            <h1 className="min-w-0 flex-1 break-words text-3xl font-bold">
              {lp.title}
            </h1>

            <div className="flex shrink-0 items-center gap-4 pt-1 text-white">
              <button type="button" aria-label="LP 수정" className="p-1">
                <Pencil size={24} strokeWidth={2.3} />
              </button>
              <button type="button" aria-label="LP 삭제" className="p-1">
                <Trash2 size={24} strokeWidth={2.3} />
              </button>
            </div>
          </div>

          <div className="mx-auto mt-14 w-full max-w-xl rounded-lg bg-[#262a32] p-5 shadow-2xl shadow-black/40">
            <div className="relative aspect-square overflow-hidden rounded-full border-4 border-black">
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-1/2 top-1/2 h-[19%] w-[19%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-500 bg-slate-100" />
            </div>
          </div>

          <p className="mx-auto mt-10 w-full max-w-2xl whitespace-pre-line break-words text-lg font-medium leading-relaxed text-white/95">
            {lp.content}
          </p>

          {lp.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {lp.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-slate-600/70 px-4 py-2 text-base font-bold text-white"
                >
                  # {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 flex items-center justify-center gap-3 text-3xl font-semibold">
            <Heart size={42} fill="#fb5d8a" strokeWidth={0} />
            <span>{lp.likes.length}</span>
          </div>
        </article>

        <article className="flex w-full flex-col rounded-lg bg-[#282b33] px-5 py-6 shadow-xl shadow-black/35 sm:px-7">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-black text-white">댓글</h1>

            <div className="inline-flex gap-2">
              <button
                type="button"
                onClick={() => setOrder("asc")}
                className={sortButtonClass("asc")}
              >
                오래된순
              </button>
              <button
                type="button"
                onClick={() => setOrder("desc")}
                className={sortButtonClass("desc")}
              >
                최신순
              </button>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="mb-7">
            <div className="flex gap-2">
              <label htmlFor="comment-content" className="sr-only">
                댓글 내용
              </label>
              <input
                id="comment-content"
                value={commentContent}
                onChange={(event) => setCommentContent(event.target.value)}
                placeholder="댓글을 입력해주세요"
                className="h-11 min-w-0 flex-1 rounded-md border border-zinc-500 bg-transparent px-4 text-sm font-semibold text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-white"
              />
              <button
                type="submit"
                disabled={trimmedComment.length === 0}
                className="h-11 shrink-0 rounded-md bg-slate-400 px-5 text-sm font-black text-white transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-zinc-300"
              >
                작성
              </button>
            </div>
            {trimmedComment.length === 0 && (
              <p className="mt-2 text-xs font-semibold text-zinc-400">
                댓글은 1자 이상 입력해주세요.
              </p>
            )}
          </form>

          {isCommentsError && (
            <p className="py-8 text-center text-sm font-semibold text-red-400">
              댓글 목록을 불러오지 못했습니다.
            </p>
          )}

          {!isCommentsLoading && !isCommentsError && comments.length === 0 && (
            <p className="py-8 text-center text-sm font-semibold text-zinc-400">
              아직 댓글이 없습니다.
            </p>
          )}

          {(isCommentsLoading || comments.length > 0 || isFetchingNextPage) && (
            <ul className="space-y-5">
              {isCommentsLoading
                ? commentSkeletons.map((index) => (
                    <CommentSkeleton
                      key={`initial-comment-skeleton-${index}`}
                    />
                  ))
                : comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}

              {isFetchingNextPage &&
                commentSkeletons.map((index) => (
                  <CommentSkeleton key={`next-comment-skeleton-${index}`} />
                ))}
            </ul>
          )}

          <div ref={loadMoreRef} className="h-10" />
        </article>
      </div>
    </section>
  );
}

export default LpDetailPage;
