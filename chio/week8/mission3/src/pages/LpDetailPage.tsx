import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Check, Heart, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useNavigate, useParams } from "react-router-dom";
import CommentSkeleton from "../components/CommentSkeleton";
import useCreateComment from "../hooks/queries/useCreateComment";
import useDeleteComment from "../hooks/queries/useDeleteComment";
import useDeleteLp from "../hooks/queries/useDeleteLp";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import useLikeLp from "../hooks/queries/useLikeLp";
import useUnlikeLp from "../hooks/queries/useUnlikeLp";
import useUpdateComment from "../hooks/queries/useUpdateComment";
import useUpdateLp from "../hooks/queries/useUpdateLp";
import useUploadImage from "../hooks/queries/useUploadImage";
import type { LpComment, RequestUpdateLpDto } from "../types/lps";

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

type CommentItemProps = {
  comment: LpComment;
  currentUserId?: number;
  activeMenuCommentId: number | null;
  editingCommentId: number | null;
  editContent: string;
  editError: string;
  isUpdating: boolean;
  isDeleting: boolean;
  onToggleMenu: (commentId: number) => void;
  onStartEdit: (comment: LpComment) => void;
  onChangeEditContent: (content: string) => void;
  onSubmitEdit: (
    event: FormEvent<HTMLFormElement>,
    commentId: number,
  ) => void;
  onDelete: (commentId: number) => void;
};

function CommentItem({
  comment,
  currentUserId,
  activeMenuCommentId,
  editingCommentId,
  editContent,
  editError,
  isUpdating,
  isDeleting,
  onToggleMenu,
  onStartEdit,
  onChangeEditContent,
  onSubmitEdit,
  onDelete,
}: CommentItemProps) {
  const authorName = comment.author.name;
  const isOwnComment = currentUserId === comment.authorId;
  const isMenuOpen = activeMenuCommentId === comment.id;
  const isEditing = editingCommentId === comment.id;
  const isEditContentEmpty = editContent.trim().length === 0;

  return (
    <li className="relative flex items-start gap-3">
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
        {isEditing ? (
          <>
            <form
              onSubmit={(event) => onSubmitEdit(event, comment.id)}
              className="mt-2 flex items-center gap-3"
            >
              <label htmlFor={`comment-edit-${comment.id}`} className="sr-only">
                댓글 수정
              </label>
              <input
                id={`comment-edit-${comment.id}`}
                value={editContent}
                onChange={(event) => onChangeEditContent(event.target.value)}
                disabled={isUpdating}
                className="h-10 min-w-0 flex-1 rounded-md border border-zinc-300 bg-transparent px-3 text-sm font-semibold text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-white disabled:text-zinc-400"
              />
              <button
                type="submit"
                aria-label="댓글 수정 완료"
                disabled={isEditContentEmpty || isUpdating}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500"
              >
                <Check size={26} strokeWidth={3} />
              </button>
            </form>
            {editError && (
              <p className="mt-2 text-xs font-semibold text-red-400">
                {editError}
              </p>
            )}
          </>
        ) : (
          <p className="mt-1 break-words text-sm font-medium leading-relaxed text-zinc-100">
            {comment.content}
          </p>
        )}
      </div>

      {isOwnComment && !isEditing && (
        <div className="relative mt-1 shrink-0">
          <button
            type="button"
            aria-label="댓글 더보기"
            aria-expanded={isMenuOpen}
            onClick={() => onToggleMenu(comment.id)}
            disabled={isDeleting}
            className="rounded-full p-1 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:text-zinc-500"
          >
            <MoreVertical size={18} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-8 z-10 flex items-center gap-1 rounded-xl bg-black px-3 py-2 shadow-lg shadow-black/40">
              <button
                type="button"
                aria-label="댓글 수정"
                onClick={() => onStartEdit(comment)}
                className="rounded-md p-1.5 text-white transition-colors hover:bg-zinc-800"
              >
                <Pencil size={20} strokeWidth={2.4} />
              </button>
              <button
                type="button"
                aria-label="댓글 삭제"
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="rounded-md p-1.5 text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-500"
              >
                <Trash2 size={20} strokeWidth={2.4} />
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function LpDetailPage() {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const lpImageInputRef = useRef<HTMLInputElement | null>(null);
  const updateLpPayloadRef = useRef<RequestUpdateLpDto | null>(null);
  const lpId = Number(lpid);
  const isValidLpId = Number.isInteger(lpId) && lpId > 0;
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [isEditingLp, setIsEditingLp] = useState(false);
  const [lpTitleInput, setLpTitleInput] = useState("");
  const [lpContentInput, setLpContentInput] = useState("");
  const [lpTagInput, setLpTagInput] = useState("");
  const [lpTagsInput, setLpTagsInput] = useState<string[]>([]);
  const [lpImageInput, setLpImageInput] = useState<File | null>(null);
  const [lpImagePreviewUrl, setLpImagePreviewUrl] = useState<string | null>(
    null,
  );
  const [lpEditError, setLpEditError] = useState("");
  const [lpLikeError, setLpLikeError] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState("");
  const [activeMenuCommentId, setActiveMenuCommentId] = useState<
    number | null
  >(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(
    null,
  );
  const [editContent, setEditContent] = useState("");
  const [editError, setEditError] = useState("");
  const {
    data: lpDetailData,
    isPending: isLpDetailPending,
    isError: isLpDetailError,
  } = useGetLpDetail(lpId);
  const { data: myInfoData } = useGetMyInfo();
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
  const createCommentMutation = useCreateComment({
    onSuccess: () => {
      setCommentContent("");
      setCommentError("");
    },
    onError: () => {
      setCommentError("댓글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
  const updateCommentMutation = useUpdateComment({
    onSuccess: () => {
      setEditingCommentId(null);
      setEditContent("");
      setEditError("");
    },
    onError: () => {
      setEditError("댓글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
  const deleteCommentMutation = useDeleteComment({
    onSuccess: () => {
      setActiveMenuCommentId(null);
    },
  });
  const updateLpMutation = useUpdateLp({
    onSuccess: () => {
      setIsEditingLp(false);
      setLpImageInput(null);
      setLpImagePreviewUrl(null);
      setLpEditError("");
      updateLpPayloadRef.current = null;

      if (lpImageInputRef.current) {
        lpImageInputRef.current.value = "";
      }
    },
    onError: () => {
      setLpEditError("LP 수정에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
  const uploadImageMutation = useUploadImage({
    onSuccess: (uploadResponse) => {
      const updatePayload = updateLpPayloadRef.current;

      if (!updatePayload) {
        setLpEditError("LP 수정 정보를 찾을 수 없습니다.");
        return;
      }

      updateLpMutation.mutate({
        lpId,
        body: {
          ...updatePayload,
          thumbnail: uploadResponse.data.imageUrl,
        },
      });
    },
    onError: () => {
      setLpEditError("이미지 업로드에 실패했습니다.");
    },
  });
  const deleteLpMutation = useDeleteLp({
    onSuccess: () => {
      navigate("/", { replace: true });
    },
    onError: () => {
      setLpEditError("LP 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
  const likeLpMutation = useLikeLp({
    onSuccess: () => {
      setLpLikeError("");
    },
    onError: () => {
      setLpLikeError("좋아요 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
  const unlikeLpMutation = useUnlikeLp({
    onSuccess: () => {
      setLpLikeError("");
    },
    onError: () => {
      setLpLikeError("좋아요 취소에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const lp = lpDetailData?.data;
  const currentUserId = myInfoData?.data.id;
  const isOwnLp = currentUserId === lp?.authorId;
  const isLikedByMe = Boolean(
    currentUserId && lp?.likes.some((like) => like.userId === currentUserId),
  );
  const comments = commentData?.pages.flatMap((page) => page.data.data) ?? [];
  const trimmedComment = commentContent.trim();
  const trimmedLpTitle = lpTitleInput.trim();
  const trimmedLpContent = lpContentInput.trim();
  const trimmedEditContent = editContent.trim();
  const isCommentSubmitting = createCommentMutation.isPending;
  const isLpSaving = uploadImageMutation.isPending || updateLpMutation.isPending;
  const isLpLikeSubmitting =
    likeLpMutation.isPending || unlikeLpMutation.isPending;
  const updatingCommentId = updateCommentMutation.variables?.commentId ?? null;
  const deletingCommentId = deleteCommentMutation.variables?.commentId ?? null;
  const commentSkeletons = Array.from(
    { length: COMMENT_SKELETON_COUNT },
    (_, index) => index,
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  useEffect(() => {
    setIsEditingLp(false);
    setLpImageInput(null);
    setLpImagePreviewUrl(null);
    setLpEditError("");
    updateLpPayloadRef.current = null;

    if (lpImageInputRef.current) {
      lpImageInputRef.current.value = "";
    }
  }, [lpId]);

  useEffect(() => {
    if (!lpImageInput) {
      setLpImagePreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(lpImageInput);
    setLpImagePreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [lpImageInput]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidLpId) {
      return;
    }

    if (trimmedComment.length === 0) {
      setCommentError("댓글은 1자 이상 입력해주세요.");
      return;
    }

    setCommentError("");
    createCommentMutation.mutate({
      lpId,
      body: {
        content: trimmedComment,
      },
    });
  };

  const handleToggleCommentMenu = (commentId: number) => {
    setActiveMenuCommentId((prevCommentId) =>
      prevCommentId === commentId ? null : commentId,
    );
  };

  const handleStartEditComment = (comment: LpComment) => {
    setActiveMenuCommentId(null);
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setEditError("");
  };

  const handleSubmitEditComment = (
    event: FormEvent<HTMLFormElement>,
    commentId: number,
  ) => {
    event.preventDefault();

    if (!isValidLpId) {
      return;
    }

    if (trimmedEditContent.length === 0) {
      setEditError("댓글은 1자 이상 입력해주세요.");
      return;
    }

    setEditError("");
    updateCommentMutation.mutate({
      lpId,
      commentId,
      body: {
        content: trimmedEditContent,
      },
    });
  };

  const handleDeleteComment = (commentId: number) => {
    if (!isValidLpId) {
      return;
    }

    deleteCommentMutation.mutate({
      lpId,
      commentId,
    });
  };

  const handleStartEditLp = () => {
    if (!lp) {
      return;
    }

    setIsEditingLp(true);
    setLpTitleInput(lp.title);
    setLpContentInput(lp.content);
    setLpTagsInput(lp.tags.map((tag) => tag.name));
    setLpTagInput("");
    setLpImageInput(null);
    setLpEditError("");
    updateLpPayloadRef.current = null;

    if (lpImageInputRef.current) {
      lpImageInputRef.current.value = "";
    }
  };

  const handleCancelEditLp = () => {
    if (isLpSaving) {
      return;
    }

    setIsEditingLp(false);
    setLpImageInput(null);
    setLpImagePreviewUrl(null);
    setLpTagInput("");
    setLpEditError("");
    updateLpPayloadRef.current = null;

    if (lpImageInputRef.current) {
      lpImageInputRef.current.value = "";
    }
  };

  const handleLpImageClick = () => {
    if (isLpSaving) {
      return;
    }

    lpImageInputRef.current?.click();
  };

  const handleLpImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setLpImageInput(selectedFile);
    setLpEditError("");
  };

  const handleAddLpTag = () => {
    const nextTag = lpTagInput.trim();

    if (!nextTag || lpTagsInput.includes(nextTag)) {
      setLpTagInput("");
      return;
    }

    setLpTagsInput((prevTags) => [...prevTags, nextTag]);
    setLpTagInput("");
    setLpEditError("");
  };

  const handleRemoveLpTag = (tagToRemove: string) => {
    setLpTagsInput((prevTags) =>
      prevTags.filter((tag) => tag !== tagToRemove),
    );
    setLpEditError("");
  };

  const handleLpTagKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddLpTag();
    }
  };

  const handleSubmitEditLp = () => {
    if (!isValidLpId) {
      return;
    }

    if (!trimmedLpTitle || !trimmedLpContent) {
      setLpEditError("LP 제목과 내용을 입력해주세요.");
      return;
    }

    if (lpTagsInput.length === 0) {
      setLpEditError("태그를 1개 이상 입력해주세요.");
      return;
    }

    setLpEditError("");
    updateLpPayloadRef.current = {
      title: trimmedLpTitle,
      content: trimmedLpContent,
      tags: lpTagsInput,
      published: lp?.published ?? true,
    };

    if (lpImageInput) {
      uploadImageMutation.mutate(lpImageInput);
      return;
    }

    updateLpMutation.mutate({
      lpId,
      body: updateLpPayloadRef.current,
    });
  };

  const handleDeleteLp = () => {
    if (!isValidLpId || deleteLpMutation.isPending) {
      return;
    }

    deleteLpMutation.mutate({ lpId });
  };

  const handleToggleLpLike = () => {
    if (!isValidLpId || !currentUserId || isLpLikeSubmitting) {
      return;
    }

    setLpLikeError("");

    if (isLikedByMe) {
      unlikeLpMutation.mutate({ lpId });
      return;
    }

    likeLpMutation.mutate({ lpId });
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
            {isEditingLp ? (
              <label htmlFor="lp-edit-title" className="sr-only">
                LP 제목 수정
              </label>
            ) : null}
            {isEditingLp ? (
              <input
                id="lp-edit-title"
                value={lpTitleInput}
                onChange={(event) => {
                  setLpTitleInput(event.target.value);
                  setLpEditError("");
                }}
                disabled={isLpSaving}
                className="min-w-0 flex-1 rounded-md border border-zinc-400 bg-transparent px-4 py-3 text-3xl font-bold text-white outline-none transition-colors focus:border-white disabled:text-zinc-400"
              />
            ) : (
              <h1 className="min-w-0 flex-1 break-words text-3xl font-bold">
                {lp.title}
              </h1>
            )}

            {isOwnLp && (
              <div className="flex shrink-0 items-center gap-4 pt-1 text-white">
                {isEditingLp ? (
                  <>
                    <button
                      type="button"
                      aria-label="LP 수정 완료"
                      onClick={handleSubmitEditLp}
                      disabled={isLpSaving}
                      className="p-1 transition-colors hover:text-[#ff1493] disabled:cursor-not-allowed disabled:text-zinc-500"
                    >
                      <Check size={28} strokeWidth={3} />
                    </button>
                    <button
                      type="button"
                      aria-label="LP 수정 취소"
                      onClick={handleCancelEditLp}
                      disabled={isLpSaving}
                      className="p-1 transition-colors hover:text-[#ff1493] disabled:cursor-not-allowed disabled:text-zinc-500"
                    >
                      <X size={28} strokeWidth={2.6} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label="LP 수정"
                      onClick={handleStartEditLp}
                      className="p-1 transition-colors hover:text-[#ff1493]"
                    >
                      <Pencil size={24} strokeWidth={2.3} />
                    </button>
                    <button
                      type="button"
                      aria-label="LP 삭제"
                      onClick={handleDeleteLp}
                      disabled={deleteLpMutation.isPending}
                      className="p-1 transition-colors hover:text-[#ff1493] disabled:cursor-not-allowed disabled:text-zinc-500"
                    >
                      <Trash2 size={24} strokeWidth={2.3} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mx-auto mt-14 w-full max-w-xl rounded-lg bg-[#262a32] p-5 shadow-2xl shadow-black/40">
            <button
              type="button"
              aria-label="LP 사진 수정"
              onClick={handleLpImageClick}
              disabled={!isEditingLp || isLpSaving}
              className="relative block aspect-square w-full overflow-hidden rounded-full border-4 border-black outline-none transition-transform enabled:hover:scale-[1.01] enabled:focus-visible:ring-4 enabled:focus-visible:ring-[#ff1493]/60 disabled:cursor-default"
            >
              <img
                src={lpImagePreviewUrl ?? lp.thumbnail}
                alt={lp.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-1/2 top-1/2 h-[19%] w-[19%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-500 bg-slate-100" />
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-500" />
            </button>
            <input
              ref={lpImageInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleLpImageChange}
              disabled={!isEditingLp || isLpSaving}
            />
          </div>

          {isEditingLp ? (
            <div className="mx-auto mt-10 w-full max-w-2xl">
              <label htmlFor="lp-edit-content" className="sr-only">
                LP 내용 수정
              </label>
              <textarea
                id="lp-edit-content"
                value={lpContentInput}
                onChange={(event) => {
                  setLpContentInput(event.target.value);
                  setLpEditError("");
                }}
                disabled={isLpSaving}
                rows={5}
                className="w-full resize-none rounded-md border border-zinc-400 bg-transparent px-4 py-3 text-lg font-medium leading-relaxed text-white outline-none transition-colors focus:border-white disabled:text-zinc-400"
              />
            </div>
          ) : (
            <p className="mx-auto mt-10 w-full max-w-2xl whitespace-pre-line break-words text-lg font-medium leading-relaxed text-white/95">
              {lp.content}
            </p>
          )}

          {isEditingLp ? (
            <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3">
              <div className="flex gap-3">
                <label htmlFor="lp-edit-tag" className="sr-only">
                  LP 태그 수정
                </label>
                <input
                  id="lp-edit-tag"
                  value={lpTagInput}
                  onChange={(event) => {
                    setLpTagInput(event.target.value);
                    setLpEditError("");
                  }}
                  onKeyDown={handleLpTagKeyDown}
                  placeholder="LP Tag"
                  disabled={isLpSaving}
                  className="h-11 min-w-0 flex-1 rounded-md border border-zinc-400 bg-transparent px-4 text-sm font-semibold text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-white disabled:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={handleAddLpTag}
                  disabled={lpTagInput.trim().length === 0 || isLpSaving}
                  className="h-11 shrink-0 rounded-md bg-slate-400 px-5 text-sm font-black text-white transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-zinc-300"
                >
                  Add
                </button>
              </div>

              {lpTagsInput.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3">
                  {lpTagsInput.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-600/70 px-4 py-2 text-base font-bold text-white"
                    >
                      # {tag}
                      <button
                        type="button"
                        aria-label={`${tag} 태그 삭제`}
                        onClick={() => handleRemoveLpTag(tag)}
                        disabled={isLpSaving}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:text-zinc-500"
                      >
                        <X size={14} strokeWidth={2.6} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : lp.tags.length > 0 ? (
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
          ) : null}

          {lpEditError && (
            <p className="mt-6 text-center text-sm font-semibold text-red-400">
              {lpEditError}
            </p>
          )}

          <div className="mt-10 flex items-center justify-center gap-3 text-3xl font-semibold">
            <button
              type="button"
              aria-label={isLikedByMe ? "LP 좋아요 취소" : "LP 좋아요"}
              aria-pressed={isLikedByMe}
              onClick={handleToggleLpLike}
              disabled={!currentUserId || isLpLikeSubmitting}
              className="rounded-full p-1 text-[#fb5d8a] transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:text-zinc-500"
            >
              <Heart
                size={42}
                fill={isLikedByMe ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={isLikedByMe ? 0 : 2.4}
              />
            </button>
            <span>{lp.likes.length}</span>
          </div>

          {lpLikeError && (
            <p className="mt-3 text-center text-sm font-semibold text-red-400">
              {lpLikeError}
            </p>
          )}
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
                onChange={(event) => {
                  setCommentContent(event.target.value);
                  setCommentError("");
                }}
                placeholder="댓글을 입력해주세요"
                disabled={isCommentSubmitting}
                className="h-11 min-w-0 flex-1 rounded-md border border-zinc-500 bg-transparent px-4 text-sm font-semibold text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-white"
              />
              <button
                type="submit"
                disabled={trimmedComment.length === 0 || isCommentSubmitting}
                className="h-11 shrink-0 rounded-md bg-slate-400 px-5 text-sm font-black text-white transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-zinc-300"
              >
                {isCommentSubmitting ? "작성 중" : "작성"}
              </button>
            </div>
            {commentError && (
              <p className="mt-2 text-xs font-semibold text-red-400">
                {commentError}
              </p>
            )}
            {!commentError && trimmedComment.length === 0 && (
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
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUserId={currentUserId}
                      activeMenuCommentId={activeMenuCommentId}
                      editingCommentId={editingCommentId}
                      editContent={editContent}
                      editError={editError}
                      isUpdating={
                        updateCommentMutation.isPending &&
                        updatingCommentId === comment.id
                      }
                      isDeleting={
                        deleteCommentMutation.isPending &&
                        deletingCommentId === comment.id
                      }
                      onToggleMenu={handleToggleCommentMenu}
                      onStartEdit={handleStartEditComment}
                      onChangeEditContent={(content) => {
                        setEditContent(content);
                        setEditError("");
                      }}
                      onSubmitEdit={handleSubmitEditComment}
                      onDelete={handleDeleteComment}
                    />
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
