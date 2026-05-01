const NotFoundPage = () => {
  return (
    <div
      className="relative min-h-dvh flex flex-col items-center justify-center
                 bg-zinc-950 text-center px-6 select-none overflow-hidden"
    >
      <div className="relative w-36 h-36 mb-10">
        <div
          className="w-full h-full rounded-full bg-zinc-900
                     border-4 border-zinc-800
                     flex items-center justify-center"
        >
          <div
            className="w-[70%] h-[70%] rounded-full border border-zinc-700/40
                       flex items-center justify-center"
          >
            <div
              className="w-[55%] h-[55%] rounded-full border border-zinc-700/30
                         flex items-center justify-center"
            >
              <div
                className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-zinc-600
                           flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-zinc-500" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute -top-1 -right-1 w-9 h-9 rounded-full
                     bg-amber-400 text-zinc-950
                     flex items-center justify-center
                     text-[10px] font-black tracking-tight"
        >
          404
        </div>
      </div>

      <p className="text-amber-400 tracking-[0.35em] text-[10px] uppercase mb-3">
        Record Not Found
      </p>

      <h1 className="text-5xl md:text-6xl font-black text-stone-100 mb-5 leading-none">
        찾을 수 없어요
      </h1>

      <p className="text-stone-500 text-sm md:text-base max-w-xs leading-relaxed mb-10">
        요청하신 LP를 찾지 못했어요.
        <br />
        바늘이 빈 홈 위를 달리고 있어요.
      </p>

      <a
        href="/"
        className="bg-amber-400 text-zinc-950 px-8 py-3
                   text-xs font-bold tracking-[0.2em] uppercase
                   hover:bg-amber-300 transition-colors"
      >
        홈으로 돌아가기
      </a>

      <div
        className="absolute left-[-6%] bottom-[15%]
                   w-48 h-48 rounded-full border-[20px] border-zinc-800/20 pointer-events-none"
      />
      <div
        className="absolute right-[-4%] top-[20%]
                   w-32 h-32 rounded-full border-[14px] border-zinc-800/15 pointer-events-none"
      />
    </div>
  );
};

export default NotFoundPage;
