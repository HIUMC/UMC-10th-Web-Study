const RECORDS = [
  {
    title: "Kind of Blue",
    artist: "Miles Davis",
    genre: "Jazz",
    price: "₩42,000",
    ring: "from-blue-900",
  },
  {
    title: "Blue Train",
    artist: "John Coltrane",
    genre: "Jazz",
    price: "₩38,000",
    ring: "from-indigo-900",
  },
  {
    title: "Rumours",
    artist: "Fleetwood Mac",
    genre: "Rock",
    price: "₩45,000",
    ring: "from-rose-900",
  },
  {
    title: "Abbey Road",
    artist: "The Beatles",
    genre: "Rock",
    price: "₩52,000",
    ring: "from-red-900",
  },
  {
    title: "Innervisions",
    artist: "Stevie Wonder",
    genre: "Soul",
    price: "₩48,000",
    ring: "from-orange-900",
  },
  {
    title: "Dummy",
    artist: "Portishead",
    genre: "Electronic",
    price: "₩35,000",
    ring: "from-zinc-800",
  },
  {
    title: "Moanin'",
    artist: "Art Blakey",
    genre: "Jazz",
    price: "₩41,000",
    ring: "from-yellow-900",
  },
  {
    title: "Pet Sounds",
    artist: "The Beach Boys",
    genre: "Pop",
    price: "₩39,000",
    ring: "from-teal-900",
  },
];

const GENRES = [
  "Jazz",
  "Rock",
  "Soul",
  "Classical",
  "Electronic",
  "R&B",
  "Blues",
  "Pop",
];

const HomePage = () => {
  return (
    <div className="bg-zinc-950 min-h-full">
      <section
        className="relative flex items-center justify-center min-h-[72vh]
                           border-b border-zinc-800 overflow-hidden"
      >
        <div
          className="absolute right-[-12%] top-1/2 -translate-y-1/2
                        w-[520px] h-[520px] rounded-full
                        border-[48px] border-zinc-800/25 pointer-events-none"
        />
        <div
          className="absolute right-[-4%] top-1/2 -translate-y-1/2
                        w-[300px] h-[300px] rounded-full
                        border-[28px] border-zinc-700/20 pointer-events-none"
        />
        <div
          className="absolute right-[4%] top-1/2 -translate-y-1/2
                        w-[120px] h-[120px] rounded-full
                        border-[14px] border-zinc-600/15 pointer-events-none"
        />

        <div className="relative z-10 text-center px-6 w-full">
          <p className="text-amber-400 tracking-[0.4em] text-xs uppercase mb-5">
            Vinyl Record Shop · Seoul
          </p>
          <h1 className="text-6xl sm:text-8xl md:text-[110px] font-black leading-none tracking-[0.18em] mb-3">
            <span className="text-amber-400">YEOP</span>
            <span className="text-stone-100">RECORD</span>
          </h1>
          <div className="max-w-md mx-auto">
            <p className="text-stone-500 text-base md:text-lg mt-6 mb-10 leading-relaxed">
              소중한 음악을 LP로.
              <br />
              엄선된 빈티지 &amp; 신보 바이닐을 만나보세요.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                className="bg-amber-400 text-zinc-950 px-8 py-3
                   text-sm font-bold tracking-[0.15em] uppercase
                   hover:bg-amber-300 transition-colors"
              >
                컬렉션 보기
              </button>
              <button
                className="border border-zinc-700 text-stone-400 px-8 py-3
                   text-sm tracking-[0.15em] uppercase
                   hover:border-zinc-500 hover:text-stone-200 transition-colors"
              >
                소개
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-2">
              New In
            </p>
            <h2 className="text-3xl font-bold text-stone-100">신착 LP</h2>
          </div>
          <a
            href="#"
            className="text-xs text-stone-600 hover:text-amber-400 transition-colors tracking-widest uppercase"
          >
            전체보기 →
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-7">
          {RECORDS.map((rec) => (
            <div key={rec.title} className="group cursor-pointer">
              <div
                className="aspect-square bg-zinc-900 border border-zinc-800 mb-3 relative overflow-hidden
                              group-hover:border-zinc-600 transition-colors"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`w-[85%] h-[85%] rounded-full bg-gradient-to-br ${rec.ring} to-zinc-950
                                  border-4 border-zinc-700/50 flex items-center justify-center`}
                  >
                    <div className="w-[30%] h-[30%] rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-zinc-500" />
                    </div>
                  </div>
                </div>
                <div
                  className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100
                                transition-opacity flex items-end p-3"
                >
                  <span className="text-xs text-amber-400 font-semibold tracking-widest">
                    담기 +
                  </span>
                </div>
              </div>
              <p className="text-amber-400/80 text-[10px] tracking-[0.25em] uppercase mb-1">
                {rec.genre}
              </p>
              <p className="text-sm font-semibold text-stone-100 leading-tight">
                {rec.title}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">{rec.artist}</p>
              <p className="text-sm font-medium text-stone-300 mt-2">
                {rec.price}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-b border-zinc-800 py-16 px-6 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-2 text-center">
            Browse
          </p>
          <h2 className="text-3xl font-bold text-stone-100 text-center mb-10">
            장르별 탐색
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                className="border border-zinc-700 text-stone-500 py-4 text-xs tracking-[0.2em] uppercase
                           hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6 text-center">
        <blockquote className="text-2xl md:text-4xl font-light text-stone-500 max-w-2xl mx-auto leading-relaxed">
          "Music is the{" "}
          <span className="text-stone-200 italic">shorthand of emotion</span>
          ."
        </blockquote>
        <p className="text-zinc-700 text-xs mt-5 tracking-[0.3em] uppercase">
          — Leo Tolstoy
        </p>
      </section>
    </div>
  );
};

export default HomePage;
