import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SearchParams } from "./types/movie";
import { fetchMovies } from "./apis/tmdb";
import SearchBar from "./components/SearchBar";
import MovieGrid from "./components/MovieGrid";
import MovieModal from "./components/MovieModal";

const RECOMMENDED = [
  "아이언맨",
  "어벤져스",
  "인터스텔라",
  "다크나이트",
  "듄",
  "오펜하이머",
  "존윅",
];

export default function App() {
  const [params, setParams] = useState<SearchParams>({
    query: "",
    includeAdult: false,
    language: "ko-KR",
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sortByRating, setSortByRating] = useState(false);

  console.log("%c[App] 렌더링", "color:#34d399; font-weight:bold");

  // 검색 결과 (검색어 없으면 인기 영화)
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["movies", params],
    queryFn: () => fetchMovies(params),
  });

  // ✅ useMemo: 평점순 정렬은 results/sortByRating가 바뀔 때만 다시 계산.
  //    모달을 열고 닫는(selectedId 변경) 리렌더에는 재계산하지 않는다.
  const movies = useMemo(() => {
    console.log("%c[useMemo] 영화 목록 가공", "color:#fbbf24");
    const list = data?.results ?? [];
    if (!sortByRating) return list;
    return [...list].sort((a, b) => b.vote_average - a.vote_average);
  }, [data, sortByRating]);

  // ✅ useCallback: 핸들러 참조를 고정 → memo(SearchBar/MovieGrid/MovieCard)가 동작
  const handleSearch = useCallback((next: SearchParams) => {
    setParams(next);
    setSortByRating(false);
  }, []);

  const handleSelect = useCallback((id: number) => setSelectedId(id), []);
  const handleClose = useCallback(() => setSelectedId(null), []);

  const handleChip = useCallback((q: string) => {
    setParams((p) => ({ ...p, query: q }));
    setSortByRating(false);
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(120%_80%_at_50%_-10%,#1e1b4b_0%,#07080d_55%)]">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {/* 헤더 */}
        <header className="mb-10 text-center">
          <h1 className="bg-gradient-to-r from-amber-200 via-orange-300 to-rose-300 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
            🍠 황구 영화관
          </h1>
          <p className="mt-3 text-sm text-white/50">
            TMDB 실시간 검색 · React 렌더링 최적화 실습 (memo · useCallback · useMemo)
          </p>
        </header>

        {/* 검색 폼 */}
        <SearchBar onSearch={handleSearch} />

        {/* 추천 검색 칩 — 클릭 한 번에 블록버스터 */}
        <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-2">
          {RECOMMENDED.map((q) => (
            <button
              key={q}
              onClick={() => handleChip(q)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:border-amber-400/40 hover:text-amber-200"
            >
              {q}
            </button>
          ))}
        </div>

        {/* 정렬 토글 — "관련 없는 state 변경"으로 useMemo 효과를 보여주는 용도 */}
        <div className="mx-auto mt-5 flex max-w-3xl items-center justify-between">
          <p className="text-sm text-white/40">
            {params.query.trim() === ""
              ? "지금 인기 있는 영화"
              : `"${params.query}" 검색 결과`}
          </p>
          <button
            onClick={() => setSortByRating((v) => !v)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
              sortByRating
                ? "border-amber-400/60 bg-amber-400/15 text-amber-300"
                : "border-white/10 text-white/60 hover:text-white"
            }`}
          >
            ★ 평점순 정렬 {sortByRating ? "ON" : "OFF"}
          </button>
        </div>

        {/* 결과 영역 */}
        <section className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-24">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/15 border-t-amber-400" />
              <p className="text-white/40">불러오는 중...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 py-24">
              <p className="text-rose-400">
                불러오기에 실패했습니다. (.env의 VITE_TMDB_TOKEN 확인)
              </p>
              <button
                onClick={() => refetch()}
                className="rounded-full bg-white/10 px-5 py-2 text-sm hover:bg-white/20"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <MovieGrid movies={movies} onSelect={handleSelect} />
          )}
        </section>
      </main>

      {/* 상세 모달 */}
      {selectedId !== null && (
        <MovieModal
          movieId={selectedId}
          language={params.language}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
