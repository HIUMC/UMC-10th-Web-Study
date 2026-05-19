const CommentSkeleton = () => (
  <li className="flex items-start gap-3 py-3">
    <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-600" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-1/4 animate-pulse rounded-full bg-gray-500" />
      <div className="h-3 w-full animate-pulse rounded-full bg-gray-500" />
    </div>
  </li>
);

export default CommentSkeleton;
