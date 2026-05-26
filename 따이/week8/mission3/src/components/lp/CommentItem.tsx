import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { deleteComment, updateComment } from "../../apis/comment";
import { lpCommentsQueryKey } from "../../hooks/queries/useGetLpComments";
import { useGetMyInfo } from "../../hooks/queries/useGetMyInfo";
import type { CommentOrder, LpComment } from "../../types/comment";

interface CommentItemProps {
  comment: LpComment;
  lpid: number;
  order: CommentOrder;
}

const PencilIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const CheckIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CommentItem = ({ comment, lpid, order }: CommentItemProps) => {
  const queryClient = useQueryClient();
  const { data: myInfo } = useGetMyInfo();
  const isOwner = myInfo?.data.id === comment.authorId;

  const name = comment.author?.name ?? "익명";
  const initial = name.charAt(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: () =>
      updateComment(lpid, comment.id, { content: editValue.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lpCommentsQueryKey(lpid, order) });
      setIsEditing(false);
    },
    onError: () => alert("댓글 수정에 실패했습니다."),
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: () => deleteComment(lpid, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lpCommentsQueryKey(lpid, order) });
    },
    onError: () => alert("댓글 삭제에 실패했습니다."),
  });

  return (
    <li className="flex items-center gap-3 py-3">
      {/* 아바타 */}
      {comment.author?.avatar ? (
        <img
          src={comment.author.avatar}
          alt={name}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600 text-xs font-bold text-white">
          {initial}
        </div>
      )}

      {/* 이름 + 내용 */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{name}</p>
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && editValue.trim()) mutateUpdate();
              if (e.key === "Escape") {
                setEditValue(comment.content);
                setIsEditing(false);
              }
            }}
            autoFocus
            className="mt-0.5 w-full rounded border border-gray-600 bg-gray-800/60 px-2 py-1 text-sm text-gray-200 focus:border-pink-500 focus:outline-none"
          />
        ) : (
          <p className="mt-0.5 break-words text-sm text-gray-300">
            {comment.content}
          </p>
        )}
      </div>

      {/* 우측 액션 */}
      {isOwner && (
        isEditing ? (
          /* 수정 모드: 체크 아이콘 */
          <button
            type="button"
            onClick={() => { if (editValue.trim()) mutateUpdate(); }}
            disabled={isUpdating || !editValue.trim()}
            aria-label="저장"
            className="shrink-0 cursor-pointer text-gray-400 hover:text-white disabled:opacity-40 p-1"
          >
            <CheckIcon />
          </button>
        ) : (
          /* 일반 모드: ... → 팝업 */
          <div ref={menuRef} className="relative shrink-0">
            <button
              type="button"
              aria-label="댓글 더보기"
              onClick={() => setMenuOpen((v) => !v)}
              className="cursor-pointer p-1 text-gray-500 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>

            {/* 팝업: ... 버튼 왼쪽 위에 열림 */}
            {menuOpen && (
              <div className="absolute right-6 top-0 z-10 flex items-center gap-0.5 rounded-xl border border-gray-700 bg-gray-800 p-1 shadow-xl">
                <button
                  type="button"
                  onClick={() => { setIsEditing(true); setMenuOpen(false); }}
                  aria-label="수정"
                  className="cursor-pointer rounded-lg p-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <PencilIcon />
                </button>
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); mutateDelete(); }}
                  aria-label="삭제"
                  className="cursor-pointer rounded-lg p-2 text-gray-300 hover:bg-gray-700 hover:text-red-400"
                >
                  <TrashIcon />
                </button>
              </div>
            )}
          </div>
        )
      )}
    </li>
  );
};

export default CommentItem;
