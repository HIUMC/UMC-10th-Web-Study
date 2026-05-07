import { useState } from "react";
import { useGetLpComments } from "../../hooks/queries/useGetLpComments";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import type { CommentOrder } from "../../types/comment";
import { ErrorBlock } from "../common/QueryStatus";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import CommentSkeleton from "./CommentSkeleton";

interface CommentSectionProps {
  lpid: number;
}

const SkeletonList = ({ count }: { count: number }) => (
  <ul>
    {Array.from({ length: count }).map((_, i) => (
      <CommentSkeleton key={i} />
    ))}
  </ul>
);

const CommentSection = ({ lpid }: CommentSectionProps) => {
  const [order, setOrder] = useState<CommentOrder>("desc");
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpComments(lpid, order);

  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onIntersect: () => fetchNextPage(),
  });

  const comments = data?.pages.flatMap((p) => p.data.data) ?? [];

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">댓글</h2>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setOrder("desc")}
            className={`cursor-pointer rounded px-2.5 py-1 transition-colors ${
              order === "desc"
                ? "bg-pink-500 text-white"
                : "border border-gray-600 text-gray-300 hover:border-gray-400"
            }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => setOrder("asc")}
            className={`cursor-pointer rounded px-2.5 py-1 transition-colors ${
              order === "asc"
                ? "bg-pink-500 text-white"
                : "border border-gray-600 text-gray-300 hover:border-gray-400"
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      <CommentForm />

      <div className="mt-6">
        {isPending ? (
          <SkeletonList count={4} />
        ) : isError ? (
          <ErrorBlock onRetry={() => refetch()} />
        ) : comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            첫 댓글을 작성해보세요.
          </p>
        ) : (
          <>
            <ul>
              {comments.map((c) => (
                <CommentItem key={c.id} comment={c} />
              ))}
            </ul>
            {isFetchingNextPage && <SkeletonList count={3} />}
            <div ref={sentinelRef} className="h-8" />
          </>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
