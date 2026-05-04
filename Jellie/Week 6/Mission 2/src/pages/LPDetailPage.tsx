import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  useInfiniteLPComments,
  useLPDetail,
  useLikeLP,
  useUnlikeLP,
} from "../hooks/queries/useLP";
import { useMyInfo } from "../hooks/queries/useUser";

type CommentOrderType = "asc" | "desc";

function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-4 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-[#1a1f24]/80" />
      <div className="flex-1">
        <div className="h-4 w-32 rounded bg-[#1a1f24]/80 mb-3" />
        <div className="h-4 w-full rounded bg-[#1a1f24]/80 mb-2" />
        <div className="h-4 w-2/3 rounded bg-[#1a1f24]/80" />
      </div>
    </div>
  );
}

function CommentSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="divide-y divide-[#e8ded4]/10">
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  );
}

export default function LPDetailPage() {
  const { lpId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const commentObserverRef = useRef<HTMLDivElement | null>(null);

  const order = (searchParams.get("commentOrder") || "desc") as CommentOrderType;

  const { data, isPending, isError, refetch } = useLPDetail(lpId);
  const { data: myInfo } = useMyInfo();

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLPComments(lpId, {
    order,
    limit: 10,
  });

  const likeMutation = useLikeLP();
  const unlikeMutation = useUnlikeLP();

  const lp = data?.data;
  const myId = myInfo?.data.id;
  const comments =
    commentsData?.pages.flatMap((page) => page.data.data) ?? [];

  const isAuthor = !!lp && !!myId && lp.authorId === myId;
  const isLiked =
    !!lp && !!myId && lp.likes.some((like) => like.userId === myId);

  const handleToggleLike = () => {
    if (!lp) return;

    if (isLiked) {
      unlikeMutation.mutate(lp.id);
    } else {
      likeMutation.mutate(lp.id);
    }
  };

  const handleTagClick = (tagName: string) => {
    navigate("/lps?search=" + encodeURIComponent(tagName));
  };

  const handleCommentOrderChange = (nextOrder: CommentOrderType) => {
    setSearchParams((prev) => {
      prev.set("commentOrder", nextOrder);
      return prev;
    });
  };

  useEffect(() => {
    if (!commentObserverRef.current) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(commentObserverRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return (
      <section className="max-w-3xl mx-auto">
        <div className="h-[600px] rounded-3xl bg-[#1a1f24]/70 animate-pulse" />
      </section>
    );
  }

  if (isError || !lp) {
    return (
      <section className="py-20 text-center">
        <p className="mb-4 text-[#c8c2b0]">LP 상세 정보를 불러오지 못했습니다.</p>
        <button onClick={() => refetch()} className="px-4 py-2 btn-primary">
          다시 시도
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto panel-analog rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {lp.author.avatar ? (
            <img
              src={lp.author.avatar}
              alt={lp.author.name}
              className="w-10 h-10 rounded-full object-cover bg-[#1a1f24]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1a1f24] flex items-center justify-center">
              👤
            </div>
          )}

          <div>
            <p className="font-bold text-[#e8ded4]">{lp.author.name}</p>
            <p className="text-xs text-[#c8c2b0]">
              올린 사람 · {new Date(lp.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isAuthor && (
          <Link to={"/lp/" + lp.id + "/edit"} className="hover:text-[#5bc3d4]">
            ✎
          </Link>
        )}
      </div>

      <h1 className="text-2xl font-black mb-8 text-[#e8ded4]">{lp.title}</h1>

      <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto mb-10">
        <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-[#0f1720] shadow-2xl animate-[spin_1.8s_linear_infinite]">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9d4c5] border-4 border-[#1a1f24]" />
        <div className="absolute top-1/2 left-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0f1720]" />
      </div>

      <p className="text-[#e8ded4] leading-7 mb-10">{lp.content}</p>

      <footer className="border-t border-[#e8ded4]/15 pt-6 mb-10">
        <div className="mb-6">
          <p className="text-sm text-[#c8c2b0] mb-3">태그</p>

          <div className="flex flex-wrap gap-2">
            {lp.tags.length > 0 ? (
              lp.tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.name)}
                  className="px-3 py-1 btn-secondary text-sm"
                >
                  #{tag.name}
                </button>
              ))
            ) : (
              <span className="text-sm text-[#9fbfc2]">
                등록된 태그가 없습니다.
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleToggleLike}
            disabled={likeMutation.isPending || unlikeMutation.isPending}
            className={
              "px-5 py-3 rounded-full border text-xl font-bold transition disabled:opacity-50 " +
              (isLiked
                ? "bg-[#3fafc0] text-[#0f1720] border-[#3fafc0]"
                : "bg-[#1a1f24]/70 text-[#e8ded4] border-[#e8ded4]/15 hover:border-[#3fafc0]")
            }
          >
            {isLiked ? "♥" : "♡"} {lp.likes.length}
          </button>
        </div>
      </footer>

      <section className="border-t border-[#e8ded4]/15 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-black text-[#e8ded4]">댓글</h2>

          <div className="flex gap-2">
            <button
              onClick={() => handleCommentOrderChange("desc")}
              className={
                "px-4 py-2 text-sm " +
                (order === "desc" ? "btn-active" : "btn-secondary")
              }
            >
              최신순
            </button>

            <button
              onClick={() => handleCommentOrderChange("asc")}
              className={
                "px-4 py-2 text-sm " +
                (order === "asc" ? "btn-active" : "btn-secondary")
              }
            >
              오래된순
            </button>
          </div>
        </div>

        <div className="mb-8">
          <textarea
            placeholder="댓글을 입력해주세요."
            className="w-full min-h-24 px-4 py-3 input-analog resize-none"
          />

          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-sm text-[#9fbfc2]">
              댓글 작성 기능은 UI만 구현되어 있습니다.
            </p>

            <button className="px-5 py-2 btn-primary" type="button">
              댓글 작성
            </button>
          </div>
        </div>

        {isCommentsLoading && <CommentSkeletonList />}

        {isCommentsError && (
          <p className="py-8 text-center text-[#c8c2b0]">
            댓글을 불러오지 못했습니다.
          </p>
        )}

        {!isCommentsLoading && !isCommentsError && comments.length === 0 && (
          <p className="py-8 text-center text-[#c8c2b0]">
            아직 댓글이 없습니다.
          </p>
        )}

        {!isCommentsLoading && !isCommentsError && comments.length > 0 && (
          <>
            <div className="divide-y divide-[#e8ded4]/10">
              {comments.map((comment) => (
                <article key={comment.id} className="flex gap-3 py-4">
                  {comment.author.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full object-cover bg-[#1a1f24]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1a1f24] flex items-center justify-center">
                      👤
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-[#e8ded4]">
                        {comment.author.name}
                      </p>
                      <p className="text-xs text-[#9fbfc2]">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-[#c8c2b0]">
                      {comment.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div ref={commentObserverRef} className="h-8" />

            {isFetchingNextPage && <CommentSkeletonList count={3} />}

            {!hasNextPage && (
              <p className="py-6 text-center text-sm text-[#9fbfc2]">
                모든 댓글을 불러왔습니다.
              </p>
            )}
          </>
        )}
      </section>
    </section>
  );
}