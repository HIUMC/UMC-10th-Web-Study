const CommentSkeleton = () => {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 animate-pulse dark:border-gray-800 dark:bg-[#1e1e24]">
      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-gray-800" />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-gray-800" />
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-gray-800" />
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-gray-800" />
      </div>
    </div>
  );
};

export const CommentSkeletonList = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  );
};

export default CommentSkeleton;
