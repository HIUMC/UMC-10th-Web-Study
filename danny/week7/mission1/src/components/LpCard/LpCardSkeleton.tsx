export default function LpCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-zinc-900 animate-pulse">
      <div className="aspect-square w-full bg-zinc-800" />

      <div className="flex flex-col gap-3 p-4">
        <div className="h-5 w-3/4 rounded bg-zinc-800" />

        <div className="flex items-center justify-between">
          <div className="h-4 w-1/3 rounded bg-zinc-800" />
          <div className="h-4 w-8 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
