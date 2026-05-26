import type { ReactNode } from "react";

interface ErrorBlockProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorBlock = ({
  message = "데이터를 불러오지 못했습니다.",
  onRetry,
}: ErrorBlockProps) => (
  <div className="flex flex-col items-center gap-3 py-12 text-center">
    <p className="text-sm text-gray-300">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer rounded bg-pink-500 px-4 py-1.5 text-sm text-white transition-colors hover:bg-pink-600"
      >
        다시 시도
      </button>
    )}
  </div>
);

interface SkeletonGridProps {
  count?: number;
  children?: ReactNode;
}

export const SkeletonGrid = ({ count = 12, children }: SkeletonGridProps) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>{children}</div>
    ))}
  </div>
);
