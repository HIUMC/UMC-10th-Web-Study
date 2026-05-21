import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FiCheck, FiEdit2, FiMoreVertical, FiSend, FiTrash2, FiX } from "react-icons/fi";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import usePostComment from "../hooks/mutations/usePostComment";
import useUpdateComment from "../hooks/mutations/useUpdateComment";
import useGetInfiniteCommentList from "../hooks/queries/useGetInfiniteCommentList";
import useThrottle from "../hooks/useThrottle";
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
  const { accessToken } = useAuth();
  const [content, setContent] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [scrollTop, setScrollTop] = useState(0);

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteCommentList(lpId, 10, order, !!accessToken);

  const postCommentMutation = usePostComment(lpId);
  const updateCommentMutation = useUpdateComment(lpId);
  const deleteCommentMutation = useDeleteComment(lpId);
  const { ref, inView } = useInView({ threshold: 0 });
  const throttledScrollTop = useThrottle(scrollTop, 1000);
  const lastFetchScrollTopRef = useRef<number | null>(null);

  const comments = useMemo(
    () => data?.pages.flatMap((page) => page.data.data) ?? [],
    [data],
  );

  const trimmedContent = content.trim();
  const isEmpty = trimmedContent.length === 0;
  const isTooLong = content.length > MAX_COMMENT_LENGTH;
  const isSubmitting = postCommentMutation.isPending;
  const validationMessage = isEmpty
    ? "댓글 내용을 입력해주세요."
    : isTooLong
      ? `댓글은 ${MAX_COMMENT_LENGTH}자 이하로 입력해주세요.`
      : "댓글을 등록할 수 있습니다.";

  useEffect(() => {
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrollTop(scrollContainer.scrollTop);
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      lastFetchScrollTopRef.current !== throttledScrollTop
    ) {
      lastFetchScrollTopRef.current = throttledScrollTop;
      console.log("fetch next comment page", new Date().toLocaleTimeString());
      fetchNextPage();
    }
  }, [throttledScrollTop, inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    lastFetchScrollTopRef.current = null;
  }, [lpId, order]);

  useEffect(() => {
    if (!accessToken) {
      setCurrentUserId(null);
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await getMyInfo();
        setCurrentUserId(response.data.id);
      } catch {
        setCurrentUserId(null);
      }
    };

    fetchCurrentUser();
  }, [accessToken]);

  const handleSubmit = () => {
    setIsTouched(true);

    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인해주세요.");
      return;
    }

    if (isEmpty || isTooLong || isSubmitting) return;

    postCommentMutation.mutate(trimmedContent, {
      onSuccess: () => {
        setContent("");
        setIsTouched(false);
      },
    });
  };

  const handleStartEdit = (commentId: number, nextContent: string) => {
    setEditingCommentId(commentId);
    setEditingContent(nextContent);
    setOpenMenuId(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleUpdateComment = (commentId: number) => {
    const nextContent = editingContent.trim();

    if (!nextContent || nextContent.length > MAX_COMMENT_LENGTH) return;

    updateCommentMutation.mutate(
      {
        commentId,
        content: nextContent,
      },
      {
        onSuccess: handleCancelEdit,
      },
    );
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId, {
      onSuccess: () => {
        setOpenMenuId(null);
      },
    });
  };

  return (
    <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-[#272930] md:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          댓글
        </h2>
        <div className="flex rounded-lg border border-slate-300 p-1 dark:border-gray-600">
          <button
            type="button"
            onClick={() => setOrder("asc")}
            className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
              order === "asc"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-500 dark:text-gray-300"
            }`}
          >
            오래된순
          </button>
          <button
            type="button"
            onClick={() => setOrder("desc")}
            className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
              order === "desc"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-500 dark:text-gray-300"
            }`}
          >
            최신순
          </button>
        </div>
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
              disabled={isEmpty || isTooLong || isSubmitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
            >
              <FiSend size={16} />
              {isSubmitting ? "작성 중" : "작성"}
            </button>
          </div>
        </div>
      </div>

      {postCommentMutation.isError && (
        <div className="mb-4 rounded-xl border border-pink-200 bg-pink-50 p-4 text-sm text-pink-500 dark:border-pink-900/50 dark:bg-pink-950/20">
          댓글을 등록하지 못했습니다.
        </div>
      )}

      {!accessToken && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-gray-800 dark:bg-[#1e1e24] dark:text-gray-400">
          로그인 후 댓글을 확인할 수 있습니다.
        </div>
      )}

      {accessToken && isPending && <CommentSkeletonList count={4} />}

      {accessToken && isError && (
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 text-sm text-pink-500 dark:border-pink-900/50 dark:bg-pink-950/20">
          댓글을 불러오지 못했습니다.
        </div>
      )}

      {accessToken && !isPending && !isError && (
        <div className="space-y-3">
          {comments.map((comment) => {
            const isOwner = currentUserId === comment.authorId;
            const isEditing = editingCommentId === comment.id;
            const isEditInvalid =
              editingContent.trim().length === 0 ||
              editingContent.length > MAX_COMMENT_LENGTH;

            return (
              <article
                key={comment.id}
                className="relative flex gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-gray-800 dark:bg-[#1e1e24]"
              >
                <img
                  src={
                    comment.author.avatar ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.authorId}`
                  }
                  alt={comment.author.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1 pr-10">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {comment.author.name}
                    </span>
                    <time className="text-xs text-slate-400">
                      {formatCommentDate(comment.createdAt)}
                    </time>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editingContent}
                        onChange={(event) =>
                          setEditingContent(event.target.value)
                        }
                        className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none focus:border-pink-500 dark:border-gray-600 dark:text-gray-200"
                      />
                      <button
                        type="button"
                        disabled={
                          isEditInvalid || updateCommentMutation.isPending
                        }
                        onClick={() => handleUpdateComment(comment.id)}
                        className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-white dark:hover:bg-gray-800"
                        aria-label="댓글 수정 완료"
                      >
                        <FiCheck />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        aria-label="댓글 수정 취소"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-gray-200">
                      {comment.content}
                    </p>
                  )}
                </div>

                {isOwner && !isEditing && (
                  <div className="absolute right-3 top-3">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId((prevId) =>
                          prevId === comment.id ? null : comment.id,
                        )
                      }
                      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      aria-label="댓글 메뉴 열기"
                    >
                      <FiMoreVertical />
                    </button>

                    {openMenuId === comment.id && (
                      <div className="absolute right-0 top-10 z-10 flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-gray-700 dark:bg-black">
                        <button
                          type="button"
                          onClick={() =>
                            handleStartEdit(comment.id, comment.content)
                          }
                          className="p-3 text-slate-700 transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-gray-800"
                          aria-label="댓글 수정"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          type="button"
                          disabled={deleteCommentMutation.isPending}
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-3 text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-white dark:hover:bg-gray-800"
                          aria-label="댓글 삭제"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}

          {comments.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-gray-800 dark:text-gray-400">
              아직 작성된 댓글이 없습니다.
            </div>
          )}
        </div>
      )}

      {(updateCommentMutation.isError || deleteCommentMutation.isError) && (
        <div className="mt-4 rounded-xl border border-pink-200 bg-pink-50 p-4 text-sm text-pink-500 dark:border-pink-900/50 dark:bg-pink-950/20">
          댓글 변경 요청에 실패했습니다.
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
