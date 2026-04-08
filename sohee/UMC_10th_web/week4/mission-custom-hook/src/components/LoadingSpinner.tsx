type LoadingSpinnerProps = {
  message?: string;
  fullHeight?: boolean;
};

export default function LoadingSpinner({
  message = '영화 정보를 불러오는 중이에요...',
  fullHeight = true,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullHeight ? 'min-h-[60vh]' : 'min-h-[12rem]'
      }`}
    >
      <div className="flex flex-col items-center gap-4 text-slate-200">
        <div
          className="size-14 animate-spin rounded-full border-4 border-amber-300/50 border-t-amber-200"
          role="status"
        >
          <span className="sr-only">로딩 중</span>
        </div>
        <p className="text-sm font-medium text-slate-300">{message}</p>
      </div>
    </div>
  );
}
