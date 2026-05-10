import LpCardSkeleton from "./LpCardSkeleton";

interface LpCardSkeletonListProps {
  count?: number;
}

export default function LpCardSkeletonList({
  count = 8,
}: LpCardSkeletonListProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <LpCardSkeleton key={index} />
      ))}
    </>
  );
}
