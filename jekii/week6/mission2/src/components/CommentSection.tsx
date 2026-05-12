import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FiSend } from "react-icons/fi";
import useGetInfiniteCommentList from "../hooks/queries/useGetInfiniteCommentList";
import { CommentSkeletonList } from "./CommentSkeleton";

type CommentSectionProps = {
  lpId: string;
};

const MAX_COMMENT_LENGTH = 300;

const formatCommentDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CommentSection = ({ lpId }: CommentSectionProps) => {
  const [content, setContent] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteCommentList(lpId, 10);
  const { ref, inView } = useInView({ threshold: 0 });

  const comments = useMemo(
    () => data?.pages.flatMap((page) => page.data.data) ?? [],
    [data],
  );
  const trimmedContent = content.trim();
  const isEmpty = trimmedContent.length === 0;
  const isTooLong = content.length > MAX_COMMENT_LENGTH;
  const validationMessage = isEmpty
    ? "댓글 내용을 입력해주세요."
    : isTooLong
      ? `댓글은 ${MAX_COMMENT_LENGTH}자 이하로 입력해주세요.`
      : "댓글을 등록할 수 있습니다.";

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  const handleSubmit = () => {
    setIsTouched(true);
  };

  return (
    <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-[#272930] md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          댓글
        </h2>
        <span className="text-sm text-slate-500 dark:text-gray-400">
          {comments.length}개
        </span>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-gray-800 dark:bg-[#1e1e24]">
        <textarea
          value={content}
          onBlur={() => setIsTouched(true)}
          onChange={(event) => setContent(event.target.value)}
          placeholder="댓글을 입력해주세요."
          className="min-h-24 w-full resize-none bg-transparent text-sm leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-gray-500"
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p
            className={`text-sm ${
              isTouched && (isEmpty || isTooLong)
                ? "text-pink-500"
                : "text-slate-500 dark:text-gray-400"
            }`}
          >
            {isTouched ? validationMessage : "댓글은 1자 이상 입력해주세요."}
          </p>
          <div className="flex items-center justify-end gap-3">
            <span className="text-xs text-slate-400">
              {content.length}/{MAX_COMMENT_LENGTH}
            </span>
            <button
              type="button"
              disabled={isEmpty || isTooLong}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
            >
              <FiSend size={16} />
              등록
            </button>
          </div>
        </div>
      </div>

      {isPending && <CommentSkeletonList count={4} />}

      {isError && (
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 text-sm text-pink-500 dark:border-pink-900/50 dark:bg-pink-950/20">
          댓글을 불러오지 못했습니다.
        </div>
      )}

      {!isPending && !isError && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-gray-800 dark:bg-[#1e1e24]"
            >
              <img
                src={
                  comment.author.avatar ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.authorId}`
                }
                alt={comment.author.name}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {comment.author.name}
                  </span>
                  <time className="text-xs text-slate-400">
                    {formatCommentDate(comment.createdAt)}
                  </time>
                </div>
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-gray-200">
                  {comment.content}
                </p>
              </div>
            </article>
          ))}

          {comments.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-gray-800 dark:text-gray-400">
              아직 작성된 댓글이 없습니다.
            </div>
          )}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="mt-3">
          <CommentSkeletonList count={3} />
        </div>
      )}

      <div ref={ref} className="h-8" />
    </section>
  );
};

export default CommentSection;
