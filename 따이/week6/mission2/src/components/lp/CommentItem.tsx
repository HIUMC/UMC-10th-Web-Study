import type { LpComment } from "../../types/comment";

interface CommentItemProps {
  comment: LpComment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const name = comment.author?.name ?? "익명";
  const initial = name.charAt(0);

  return (
    <li className="flex items-start gap-3 py-3">
      {comment.author?.avatar ? (
        <img
          src={comment.author.avatar}
          alt={name}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="mt-0.5 break-words text-sm text-gray-200">
          {comment.content}
        </p>
      </div>
      <button
        type="button"
        aria-label="댓글 더보기"
        className="shrink-0 cursor-pointer p-1 text-gray-400 hover:text-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="12" cy="19" r="1.6" />
        </svg>
      </button>
    </li>
  );
};

export default CommentItem;
