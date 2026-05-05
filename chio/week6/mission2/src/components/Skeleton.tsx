import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={["animate-pulse bg-slate-400", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export default Skeleton;
