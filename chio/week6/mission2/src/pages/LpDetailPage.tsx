import { useEffect, useState, type FormEvent } from "react";
import { MoreVertical } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import CommentSkeleton from "../components/CommentSkeleton";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import type { LpComment } from "../types/lps";

const COMMENT_PAGE_LIMIT = 10;
const COMMENT_SKELETON_COUNT = 10;

const getRelativeTime = (value: Date) => {
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
  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: "240px",
  });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetLpComments({
    lpId,
    order,
    limit: COMMENT_PAGE_LIMIT,
  });

  const comments = data?.pages.flatMap((page) => page.data.data) ?? [];
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

  return (
    <section className="min-h-full bg-black px-5 py-8 text-white md:px-12 lg:px-20">
      <article className="mx-auto flex w-full max-w-4xl flex-col rounded-lg bg-[#282b33] px-5 py-6 shadow-xl shadow-black/35 sm:px-7">
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

        {isError && (
          <p className="py-8 text-center text-sm font-semibold text-red-400">
            댓글 목록을 불러오지 못했습니다.
          </p>
        )}

        {!isLoading && !isError && comments.length === 0 && (
          <p className="py-8 text-center text-sm font-semibold text-zinc-400">
            아직 댓글이 없습니다.
          </p>
        )}

        {(isLoading || comments.length > 0 || isFetchingNextPage) && (
          <ul className="space-y-5">
            {isLoading
              ? commentSkeletons.map((index) => (
                  <CommentSkeleton key={`initial-comment-skeleton-${index}`} />
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
    </section>
  );
}

export default LpDetailPage;
