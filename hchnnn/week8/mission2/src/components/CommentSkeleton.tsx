const CommentSkeleton = () => {
  return (
    <div className="comment-skeleton">
      <div className="comment-skeleton-profile skeleton-shimmer" />

      <div className="comment-skeleton-content">
        <div className="comment-skeleton-name skeleton-shimmer" />
        <div className="comment-skeleton-text skeleton-shimmer" />
      </div>
    </div>
  );
};

export default CommentSkeleton;