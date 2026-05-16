import { useState } from 'react';
import type { Comment } from '../types/comment';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useUpdateComment } from '../hooks/useUpdateComment';

interface CommentItemProps {
  lpId: string;
  comment: Comment;
  currentUserId?: number;
}

const CommentItem = ({ lpId, comment, currentUserId }: CommentItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const updateCommentMutation = useUpdateComment(lpId);
  const deleteCommentMutation = useDeleteComment(lpId);

  const writerId =
    comment.authorId ?? comment.userId ?? comment.author?.id ?? comment.user?.id;

  const isMine = currentUserId !== undefined && currentUserId === writerId;

  const writerName =
    comment.author?.name ??
    comment.author?.nickname ??
    comment.user?.name ??
    comment.user?.nickname ??
    '익명';

  const firstLetter = writerName.slice(0, 1);

  const handleUpdate = () => {
    const nextContent = editContent.trim();

    if (!nextContent) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    updateCommentMutation.mutate(
      {
        commentId: comment.id,
        payload: {
          content: nextContent,
        },
      },
      {
        onSuccess: () => {
          setIsEditMode(false);
          setIsMenuOpen(false);
        },
      }
    );
  };

  const handleDelete = () => {
    const confirmed = window.confirm('댓글을 삭제하시겠습니까?');

    if (!confirmed) return;

    deleteCommentMutation.mutate(comment.id);
  };

  return (
    <div className="comment-item">
      <div className="comment-profile">{firstLetter}</div>

      <div className="comment-body">
        <strong className="comment-author">{writerName}</strong>

        {isEditMode ? (
          <div className="comment-edit-box">
            <input
              className="comment-edit-input"
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
            />

            <div className="comment-edit-actions">
              <button
                type="button"
                onClick={() => {
                  setIsEditMode(false);
                  setEditContent(comment.content);
                }}
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={updateCommentMutation.isPending}
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-content">{comment.content}</p>
        )}
      </div>

      {isMine && (
        <div className="comment-menu-wrap">
          <button
            type="button"
            className="comment-more-button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            …
          </button>

          {isMenuOpen && (
            <div className="comment-menu">
              <button
                type="button"
                onClick={() => {
                  setIsEditMode(true);
                  setIsMenuOpen(false);
                }}
              >
                수정
              </button>

              <button type="button" onClick={handleDelete}>
                삭제
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;