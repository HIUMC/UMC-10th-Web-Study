import { FiRefreshCw } from "react-icons/fi";

type LoadingStateProps = {
  variant?: "list" | "detail";
};

export const LoadingState = ({ variant = "list" }: LoadingStateProps) => {
  if (variant === "detail") {
    return (
      <div className="w-full max-w-5xl mx-auto pb-12 animate-pulse">
        <div className="rounded-2xl bg-slate-200 dark:bg-[#1e1e24] h-[760px]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 animate-pulse">
      <div className="flex justify-end mb-8">
        <div className="h-10 w-40 bg-slate-200 dark:bg-gray-800 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-square bg-slate-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-5 w-3/4 bg-slate-200 dark:bg-gray-800 rounded-md" />
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-gray-800 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

type ErrorStateProps = {
  onRetry: () => void;
};

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center pt-32 pb-12 gap-4">
      <div className="text-pink-500 font-medium text-lg">
        데이터를 불러오는데 실패했습니다.
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#1e1e24] border border-slate-200 dark:border-gray-800 rounded-xl hover:bg-slate-50 dark:hover:bg-[#2a2b36] transition-colors"
      >
        <FiRefreshCw />
        <span>다시 시도하기</span>
      </button>
    </div>
  );
};
