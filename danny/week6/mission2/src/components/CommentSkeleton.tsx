export default function CommentSkeleton() {
  return (
    <div className="flex gap-4 py-3 animate-pulse">
      <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-800"></div>
      <div className="flex w-full flex-col gap-2 pt-1">
        <div className="h-4 w-24 rounded bg-zinc-800"></div>
        <div className="h-4 w-3/4 rounded bg-zinc-800"></div>
      </div>
    </div>
  );
}
