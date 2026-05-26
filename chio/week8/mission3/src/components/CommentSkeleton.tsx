import Skeleton from "./Skeleton";

function CommentSkeleton() {
  return (
    <li aria-hidden="true" className="flex items-start gap-3">
      <Skeleton className="mt-1 h-9 w-9 shrink-0 rounded-full" />

      <div className="min-w-0 flex-1">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="mt-2 h-4 w-full rounded-full" />
      </div>
    </li>
  );
}

export default CommentSkeleton;
