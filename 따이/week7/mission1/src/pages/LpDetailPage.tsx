import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteLp, toggleLike } from "../apis/lp";
import { ErrorBlock } from "../components/common/QueryStatus";
import LpFormModal from "../components/lp/LpFormModal";
import CommentSection from "../components/lp/CommentSection";
import { lpQueryKey, useGetLp } from "../hooks/queries/useGetLp";
import { useGetMyInfo } from "../hooks/queries/useGetMyInfo";
import type { Lp } from "../types/lp";
import { formatTimeAgo } from "../utils/time";

const Backdrop = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 md:p-8"
    onClick={onClose}
  >
    <div className="my-auto w-full max-w-3xl py-4" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const LpDetailPage = () => {
  const { lpid } = useParams();
  const id = Number(lpid);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isPending, isError, refetch } = useGetLp(id);
  const { data: myInfo } = useGetMyInfo();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleClose = () => navigate("/lp");

  if (!Number.isFinite(id) || id <= 0) {
    return (
      <Backdrop onClose={handleClose}>
        <div className="rounded-2xl bg-gray-900 p-8">
          <ErrorBlock message="잘못된 LP 주소입니다." />
        </div>
      </Backdrop>
    );
  }

  if (isPending) {
    return (
      <Backdrop onClose={handleClose}>
        <div className="rounded-2xl bg-gray-900 p-8">
          <div className="mx-auto aspect-square w-full max-w-md animate-pulse rounded-full bg-gray-800" />
        </div>
      </Backdrop>
    );
  }

  if (isError) {
    return (
      <Backdrop onClose={handleClose}>
        <div className="rounded-2xl bg-gray-900 p-8">
          <ErrorBlock onRetry={() => refetch()} />
        </div>
      </Backdrop>
    );
  }

  const lp = data!.data;
  const likeCount = Array.isArray(lp.likes) ? lp.likes.length : 0;
  const isLiked =
    Array.isArray(lp.likes) && myInfo
      ? lp.likes.some((l) => l.userId === myInfo.data.id)
      : false;
  const isOwner = myInfo?.data.id === lp.authorId;

  return (
    <Backdrop onClose={handleClose}>
      <LpDetailContent
        lp={lp}
        id={id}
        likeCount={likeCount}
        isLiked={isLiked}
        isOwner={isOwner}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        navigate={navigate}
        queryClient={queryClient}
      />
    </Backdrop>
  );
};

interface LpDetailContentProps {
  lp: Lp;
  id: number;
  likeCount: number;
  isLiked: boolean;
  isOwner: boolean;
  isEditOpen: boolean;
  setIsEditOpen: (v: boolean) => void;
  navigate: ReturnType<typeof useNavigate>;
  queryClient: ReturnType<typeof useQueryClient>;
}

const LpDetailContent = ({
  lp,
  id,
  likeCount,
  isLiked,
  isOwner,
  isEditOpen,
  setIsEditOpen,
  navigate,
  queryClient,
}: LpDetailContentProps) => {
  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteLp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate("/lp");
    },
    onError: () => alert("LP 삭제에 실패했습니다."),
  });

  const { mutate: mutateLike } = useMutation({
    mutationFn: () => toggleLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lpQueryKey(id) });
    },
  });

  const handleDelete = () => {
    if (window.confirm("정말 이 LP를 삭제하시겠어요?")) {
      mutateDelete();
    }
  };

  return (
    <>
      <article className="rounded-2xl bg-gray-900 p-6 md:p-10">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {lp.author?.avatar ? (
              <img
                src={lp.author.avatar}
                alt={lp.author.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-emerald-500/70" />
            )}
            <span className="font-semibold text-white">
              {lp.author?.name ?? "익명"}
            </span>
          </div>
          <span className="text-sm text-gray-400">
            {formatTimeAgo(lp.createdAt)}
          </span>
        </header>

        <div className="mt-6 flex items-start justify-between gap-4">
          <h1 className="break-words text-2xl font-bold text-white md:text-3xl">
            {lp.title}
          </h1>
          {isOwner && (
            <div className="flex shrink-0 gap-3 text-gray-300">
              <button
                type="button"
                aria-label="수정"
                onClick={() => setIsEditOpen(true)}
                className="cursor-pointer p-1 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 20h4l10-10-4-4L4 16v4z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="삭제"
                onClick={handleDelete}
                disabled={isDeleting}
                className="cursor-pointer p-1 hover:text-white disabled:opacity-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 7h14M10 11v6M14 11v6M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <div className="relative aspect-square w-full max-w-md">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="h-full w-full rounded-full object-cover shadow-[0_0_60px_rgba(0,0,0,0.6)]"
            />
            <div className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-200 ring-4 ring-gray-900" />
          </div>
        </div>

        <p className="mt-8 whitespace-pre-wrap break-words text-center text-gray-200">
          {lp.content}
        </p>

        {lp.tags && lp.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {lp.tags.map((tag) => (
              <li
                key={tag.id}
                className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300"
              >
                # {tag.name}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="좋아요"
            onClick={() => mutateLike()}
            className={`cursor-pointer text-2xl transition-transform hover:scale-110 ${
              isLiked ? "text-pink-500" : "text-gray-500"
            }`}
          >
            ♥
          </button>
          <span className="text-white">{likeCount}</span>
        </div>

        <CommentSection lpid={id} />
      </article>

      {isEditOpen && (
        <LpFormModal
          mode="edit"
          lpId={id}
          initialValues={{
            title: lp.title,
            content: lp.content,
            thumbnail: lp.thumbnail,
            tags: lp.tags?.map((t) => t.name) ?? [],
          }}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
};

export default LpDetailPage;
