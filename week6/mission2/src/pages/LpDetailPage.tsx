import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Heart, Pencil, Trash2 } from "lucide-react";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { formatRelativeTime } from "../utils/formatDate";

const LpDetailPage = () => {
  const { lpId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");

  const parsedLpId = Number(lpId);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const orderParam = searchParams.get("order");
  const commentOrder = orderParam === "asc" ? "asc" : "desc";

  const { data, isLoading, isError } = useGetLpDetail(parsedLpId);
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpComments(parsedLpId, { limit: 10, order: commentOrder });

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const comments = commentsData?.pages.flatMap((page) => page.data.data) ?? [];

  if (!Number.isFinite(parsedLpId)) {
    return (
      <section className="min-h-full bg-black px-6 py-10">
        <p className="text-red-400">잘못된 LP 주소입니다.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="min-h-full bg-black px-6 py-10">
        <p className="text-gray-400">LP 상세 정보를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="min-h-full bg-black px-6 py-10">
        <p className="text-red-400">LP 상세 정보를 불러오지 못했습니다.</p>
      </section>
    );
  }

  const lp = data.data;

  return (
    <section className="min-h-full bg-black px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-5xl rounded-lg bg-[#2a2d34] px-6 py-8 shadow-2xl sm:px-10 lg:px-16">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-base font-bold text-gray-700">
              {lp.author.avatar ? (
                <img
                  src={lp.author.avatar}
                  alt={lp.author.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                lp.author.name.slice(0, 1)
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold">
                {lp.author.name}
              </p>
              <Link
                to="/"
                className="text-sm text-gray-400 transition-colors hover:text-[#ff1493]"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </div>

          <span className="shrink-0 text-sm font-medium text-gray-300">
            {formatRelativeTime(lp.createdAt)}
          </span>
        </div>

        <div className="mt-10 flex items-start justify-between gap-6">
          <h1 className="min-w-0 text-3xl font-extrabold text-white">
            {lp.title}
          </h1>

          <div className="flex shrink-0 items-center gap-4 text-gray-100">
            <button
              type="button"
              aria-label="LP 수정"
              className="transition-colors hover:text-[#ff1493]"
            >
              <Pencil size={24} />
            </button>
            <button
              type="button"
              aria-label="LP 삭제"
              className="transition-colors hover:text-[#ff1493]"
            >
              <Trash2 size={24} />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <div className="aspect-square rounded-md bg-[#252932] p-8 shadow-xl">
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-black bg-black shadow-2xl">
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-300 bg-gray-100 shadow-inner" />
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-3xl whitespace-pre-line text-base leading-8 text-gray-100">
          {lp.content}
        </p>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {lp.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-slate-600 px-4 py-2 text-sm font-bold text-white"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-2xl font-bold">
          <Heart size={36} fill="currentColor" className="text-[#ff5d8f]" />
          <span>{lp.likes.length}</span>
        </div>

        <div className="mt-10 rounded-3xl bg-[#17191f] p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">댓글</h2>
              <span className="text-sm text-gray-400">{comments.length}개</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-zinc-700 bg-[#10131a] p-1">
              <button
                type="button"
                onClick={() => setSearchParams({ order: "desc" })}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  commentOrder === "desc"
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                최신순
              </button>
              <button
                type="button"
                onClick={() => setSearchParams({ order: "asc" })}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  commentOrder === "asc"
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                오래된순
              </button>
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const trimmed = commentText.trim();
              if (trimmed.length < 5) {
                setCommentError("댓글은 5자 이상 입력해주세요.");
                return;
              }
              setCommentError("");
            }}
            className="mb-6 rounded-3xl border border-zinc-700 bg-[#22272f] p-5"
          >
            <label className="mb-3 block text-sm font-bold text-white" htmlFor="comment-input">
              댓글 작성
            </label>
            <textarea
              id="comment-input"
              value={commentText}
              onChange={(event) => {
                setCommentText(event.target.value);
                if (commentError) setCommentError("");
              }}
              rows={4}
              placeholder="댓글을 입력해주세요. (최소 5자)"
              className="w-full rounded-3xl border border-zinc-700 bg-[#17191f] px-4 py-3 text-sm text-gray-100 outline-none transition-colors focus:border-white focus:ring-2 focus:ring-white/10"
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className={`text-sm ${commentError ? "text-red-400" : "text-gray-400"}`}>
                {commentError || "댓글은 5자 이상 입력해야 등록할 수 있습니다."}
              </p>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-[#ff1493] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e80f84] sm:mt-0 sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
                disabled={commentText.trim().length < 5}
              >
                댓글 등록
              </button>
            </div>
          </form>

          {isCommentsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-zinc-700 bg-[#22272f] p-5 animate-pulse"
                >
                  <div className="mb-3 h-4 w-32 rounded-full bg-zinc-700" />
                  <div className="h-3 w-24 rounded-full bg-zinc-700" />
                  <div className="mt-4 h-20 rounded-2xl bg-zinc-800" />
                </div>
              ))}
            </div>
          ) : isCommentsError ? (
            <p className="text-red-400">댓글을 불러오지 못했습니다.</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-400">등록된 댓글이 없습니다.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="rounded-3xl border border-zinc-700 bg-[#22272f] p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-bold text-white">{comment.author.name}</p>
                      <span className="text-sm text-gray-400">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="mt-4 text-gray-200">{comment.content}</p>
                  </li>
                ))}
              </ul>

              {isFetchingNextPage ? (
                <div className="mt-4 space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-zinc-700 bg-[#22272f] p-5 animate-pulse"
                    >
                      <div className="mb-3 h-4 w-32 rounded-full bg-zinc-700" />
                      <div className="h-3 w-24 rounded-full bg-zinc-700" />
                      <div className="mt-4 h-20 rounded-2xl bg-zinc-800" />
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          )}

          {hasNextPage ? (
            <div ref={loadMoreRef} className="mt-6 h-1 w-full rounded-full bg-transparent" />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default LpDetailPage;
