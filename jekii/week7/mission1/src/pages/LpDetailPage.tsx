import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiCheck, FiEdit2, FiHeart, FiTrash2, FiX } from "react-icons/fi";
import { getMyInfo } from "../apis/auth";
import CommentSection from "../components/CommentSection";
import { ErrorState, LoadingState } from "../components/FetchState";
import LpRecord from "../components/LpRecord";
import { useAuth } from "../context/AuthContext";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import useDeleteLp from "../hooks/mutations/useDeleteLp";
import usePostLike from "../hooks/mutations/usePostLike";
import useUpdateLp from "../hooks/mutations/useUpdateLp";
import useUploadImage from "../hooks/mutations/useUploadImage";
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
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { data: lp, isPending, isError, refetch } = useGetLpDetail(lpId || "");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editThumbnail, setEditThumbnail] = useState("");
  const [editTags, setEditTags] = useState("");
  const updateLpMutation = useUpdateLp();
  const deleteLpMutation = useDeleteLp();
  const postLikeMutation = usePostLike();
  const deleteLikeMutation = useDeleteLike();
  const uploadImageMutation = useUploadImage();

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

  const likeCount = lp?.likes.length ?? 0;
  const isOwner = !!lp && currentUserId === lp.authorId;
  const isLiked = !!lp?.likes.some((like) => like.userId === currentUserId);

  const openEditForm = () => {
    if (!lp) return;

    setEditTitle(lp.title);
    setEditContent(lp.content);
    setEditThumbnail(lp.thumbnail);
    setEditTags(lp.tags.map((tag) => tag.name).join(", "));
    setIsEditing(true);
  };

  const closeEditForm = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
    setEditThumbnail("");
    setEditTags("");
  };

  const handleUpdateLp = () => {
    if (!lpId || !editTitle.trim() || !editContent.trim()) return;

    updateLpMutation.mutate(
      {
        lpId,
        body: {
          title: editTitle.trim(),
          content: editContent.trim(),
          thumbnail: editThumbnail.trim(),
          tags: editTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          published: true,
        },
      },
      {
        onSuccess: () => {
          closeEditForm();
          refetch();
        },
      },
    );
  };

  const handleEditImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일을 선택해주세요.");
      event.target.value = "";
      return;
    }

    uploadImageMutation.mutate(file, {
      onSuccess: ({ data }) => {
        setEditThumbnail(data.imageUrl);
      },
      onError: () => {
        alert("이미지 업로드에 실패했습니다.");
        event.target.value = "";
      },
    });
  };

  const handleDeleteLp = () => {
    if (!lpId || !window.confirm("정말 이 LP를 삭제하시겠습니까?")) return;

    deleteLpMutation.mutate(lpId, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  const handleToggleLike = () => {
    if (!accessToken || !lpId) {
      alert("로그인이 필요한 서비스입니다. 로그인해주세요.");
      return;
    }

    const body = { lpId: Number(lpId) };
    const mutation = isLiked ? deleteLikeMutation : postLikeMutation;

    mutation.mutate(body, {
      onSuccess: () => {
        refetch();
      },
    });
  };

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
            {isOwner && (
              <div className="flex items-center gap-4 text-slate-600 dark:text-gray-100">
                <button
                  type="button"
                  aria-label="LP 수정"
                  onClick={openEditForm}
                  className="transition-colors hover:text-pink-500"
                >
                  <FiEdit2 size={20} />
                </button>
                <button
                  type="button"
                  aria-label="LP 삭제"
                  onClick={handleDeleteLp}
                  disabled={deleteLpMutation.isPending}
                  className="transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            )}
          </div>
        </header>

        {isEditing ? (
          <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-gray-800 dark:bg-[#1e1e24]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">
                LP 수정
              </h2>
              <button
                type="button"
                onClick={closeEditForm}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="LP 수정 취소"
              >
                <FiX />
              </button>
            </div>
            <div className="grid gap-3">
              <input
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-pink-500 dark:border-gray-700 dark:bg-[#272930] dark:text-white"
                placeholder="LP 제목"
              />
              <textarea
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                className="min-h-28 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-pink-500 dark:border-gray-700 dark:bg-[#272930] dark:text-white"
                placeholder="LP 내용"
              />
              <input
                value={editThumbnail}
                onChange={(event) => setEditThumbnail(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-pink-500 dark:border-gray-700 dark:bg-[#272930] dark:text-white"
                placeholder="썸네일 URL"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-600 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white dark:border-gray-700 dark:bg-[#272930] dark:text-white"
              />
              {uploadImageMutation.isPending && (
                <p className="text-sm text-slate-500 dark:text-gray-300">
                  이미지 업로드 중...
                </p>
              )}
              <input
                value={editTags}
                onChange={(event) => setEditTags(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-pink-500 dark:border-gray-700 dark:bg-[#272930] dark:text-white"
                placeholder="태그를 쉼표로 구분해 입력해주세요."
              />
            </div>
            {updateLpMutation.isError && (
              <p className="mt-3 text-sm text-pink-500">
                LP 수정에 실패했습니다.
              </p>
            )}
            <button
              type="button"
              onClick={handleUpdateLp}
              disabled={
                !editTitle.trim() ||
                !editContent.trim() ||
                uploadImageMutation.isPending ||
                updateLpMutation.isPending
              }
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-bold text-white transition-colors hover:bg-pink-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-gray-700"
            >
              <FiCheck />
              {updateLpMutation.isPending ? "저장 중" : "저장"}
            </button>
          </section>
        ) : (
          <>
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
          </>
        )}

        <section className="flex justify-center">
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={postLikeMutation.isPending || deleteLikeMutation.isPending}
            className="flex items-center gap-2 text-2xl font-semibold text-slate-800 transition-colors hover:text-pink-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
          >
            <FiHeart
              className={isLiked ? "fill-pink-400 text-pink-400" : ""}
              size={34}
            />
            <span>{likeCount}</span>
          </button>
        </section>
      </article>

      {lpId && <CommentSection lpId={lpId} />}
    </div>
  );
};

export default LpDetailPage;
