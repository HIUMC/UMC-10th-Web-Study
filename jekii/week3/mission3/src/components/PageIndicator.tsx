interface PageIndicatorProps {
  page: number;
  onClick: (i: number) => void;
}

export const PageIndicator = ({ page, onClick }: PageIndicatorProps) => {
  return (
    <div className="flex items-center gap-4 rounded-full bg-zinc-900/90 px-4 py-3 shadow-lg border border-white/10">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onClick(-1)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white text-lg font-bold transition-all duration-200 hover:bg-[#b2dab1] hover:text-black disabled:bg-zinc-800 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        {"<"}
      </button>

      <div className="min-w-[96px] text-center">
        <p className="text-xs text-gray-400">현재 페이지</p>
        <p className="text-lg font-bold text-white">{page}</p>
      </div>

      <button
        type="button"
        onClick={() => onClick(1)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white text-lg font-bold transition-all duration-200 hover:bg-[#b2dab1] hover:text-black"
      >
        {">"}
      </button>
    </div>
  );
};
