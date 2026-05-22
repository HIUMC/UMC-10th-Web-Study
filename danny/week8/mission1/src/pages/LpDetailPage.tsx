import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import { useGetComments } from "../hooks/queries/useGetComments";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { usePostLike } from "../hooks/mutations/usePostLike";
import { useDeleteLike } from "../hooks/mutations/useDeleteLike";
import { useCreateComment } from "../hooks/mutations/useCreateComment";
import { useDeleteComment } from "../hooks/mutations/useDeleteComment";
import { useUpdateComment } from "../hooks/mutations/useUpdateComment";
import { useDeleteLp } from "../hooks/mutations/useDeleteLp";

export default function LpDetailPage() {
  const { lpid } = useParams();
  const lpId = Number(lpid);
  const { ref, inView } = useInView();

  const { data: myInfo } = useGetMyInfo();
  const currentUserId = myInfo?.data?.id;

  const { data: lpData, isLoading: isLpLoading } = useGetLpDetail(lpId);
  const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetComments(lpId, commentOrder);

  const { mutate: postLike } = usePostLike();
  const { mutate: deleteLike } = useDeleteLike();
  const { mutate: createComment } = useCreateComment();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteLp } = useDeleteLp();

  const [commentInput, setCommentInput] = useState("");

  const isMyLp = lpData?.authorId === currentUserId;
  const isLiked =
    lpData?.likes?.some((like: any) => like.userId === currentUserId) || false;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLikeToggle = () => {
    if (isLiked) deleteLike(lpId);
    else postLike(lpId);
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    createComment(
      { lpId, content: commentInput },
      {
        onSuccess: () => setCommentInput(""),
      },
    );
  };

  const handleDeleteLp = () => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      deleteLp(lpId);
    }
  };

  const handleUpdateComment = (commentId: number, currentContent: string) => {
    const newContent = window.prompt("댓글을 수정하세요:", currentContent);
    if (
      newContent !== null &&
      newContent.trim() !== "" &&
      newContent !== currentContent
    ) {
      updateComment({ lpId, commentId, content: newContent.trim() });
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      deleteComment({ lpId, commentId });
    }
  };

  if (isLpLoading) return <div className="p-8 text-white">로딩 중...</div>;

  const comments = commentData?.pages.flatMap((page) => page.data || []) || [];

  return (
    <div className="flex w-full flex-col items-center p-6 lg:p-10 bg-[#121212]">
      <div className="w-full max-w-[860px] rounded-[24px] bg-[#1f1f22] px-8 py-10 shadow-2xl sm:px-12">
        <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 font-bold text-white">
              {lpData?.author?.name?.[0] ?? "?"}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white">
                {lpData?.author?.name}
              </span>
              <span className="text-xs text-zinc-500">
                {lpData?.createdAt
                  ? new Date(lpData.createdAt).toLocaleDateString()
                  : ""}
              </span>
            </div>
          </div>

          {isMyLp && (
            <div className="flex gap-3 text-zinc-400">
              <button
                onClick={() => alert("수정 기능이 준비 중입니다.")}
                className="hover:text-white transition-colors"
              >
                수정
              </button>
              <button
                onClick={handleDeleteLp}
                className="hover:text-red-500 transition-colors"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <h1 className="mb-6 text-[24px] font-bold text-white sm:text-[28px] text-center">
          {lpData?.title}
        </h1>

        <div className="mb-10 flex justify-center">
          <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-full border-[12px] border-zinc-900 shadow-2xl animate-[spin_10s_linear_infinite]">
            <img
              src={lpData?.thumbnail}
              alt="LP"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#121212] border-4 border-zinc-800" />
          </div>
        </div>

        <p className="mx-auto mb-10 max-w-[660px] text-center text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {lpData?.content}
        </p>

        <div className="flex justify-center border-b border-zinc-800 pb-10">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 transition-colors ${
              isLiked ? "text-pink-500" : "text-zinc-500 hover:text-pink-500"
            }`}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-[18px] font-bold">
              {lpData?.likes?.length || 0}
            </span>
          </button>
        </div>

        <div className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">댓글</h3>
            <div className="flex gap-3 text-sm">
              <button
                onClick={() => setCommentOrder("desc")}
                className={
                  commentOrder === "desc"
                    ? "text-white font-bold"
                    : "text-zinc-500"
                }
              >
                최신순
              </button>
              <button
                onClick={() => setCommentOrder("asc")}
                className={
                  commentOrder === "asc"
                    ? "text-white font-bold"
                    : "text-zinc-500"
                }
              >
                오래된순
              </button>
            </div>
          </div>

          <div className="mb-10 flex gap-3">
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="댓글을 입력해주세요"
              className="flex-1 rounded-md bg-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCommentSubmit();
              }}
            />
            <button
              onClick={handleCommentSubmit}
              className="rounded-md bg-zinc-700 px-6 font-bold text-white hover:bg-zinc-600 transition-colors"
            >
              작성
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {comments.map((comment: any) => {
              const isMyComment = comment.author?.id === currentUserId;

              return (
                <div key={comment.id} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-700 font-bold text-white">
                    {comment.author?.name?.[0]}
                  </div>
                  <div className="flex flex-1 flex-col rounded-2xl bg-zinc-800/50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {comment.author?.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {isMyComment && (
                        <div className="flex gap-2 text-xs text-zinc-400">
                          <button
                            onClick={() =>
                              handleUpdateComment(comment.id, comment.content)
                            }
                            className="hover:text-white transition-colors"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="hover:text-red-400 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-zinc-300">{comment.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div ref={ref} className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
