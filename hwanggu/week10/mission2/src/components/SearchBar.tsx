import { memo, useState, type FormEvent } from "react";
import type { Language, SearchParams } from "../types/movie";

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "ko-KR", label: "한국어" },
  { value: "en-US", label: "English" },
  { value: "ja-JP", label: "日本語" },
];

/**
 * 검색 폼.
 * 입력값(query/adult/language)은 "로컬 state"로만 관리하고, 제출할 때만
 * onSearch로 상위에 올린다. → 타이핑할 때마다 영화 그리드가 리렌더되지 않음.
 * memo로 감싸서 상위(App)가 리렌더돼도 props(onSearch 참조)가 같으면 스킵.
 */
function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<Language>("ko-KR");

  console.log("%c[SearchBar] 렌더링", "color:#f59e0b");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch({ query: query.trim(), includeAdult, language });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-5 shadow-2xl shadow-black/40"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="영화 제목을 입력하세요 (예: Iron Man)"
          className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition"
        />
        <button
          type="submit"
          className="rounded-xl px-6 py-3 text-sm font-bold text-black bg-gradient-to-r from-amber-300 to-orange-400 hover:from-amber-200 hover:to-orange-300 active:scale-95 transition shadow-lg shadow-orange-500/20"
        >
          🔍 검색
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={(e) => setIncludeAdult(e.target.checked)}
            className="w-4 h-4 accent-amber-400"
          />
          성인 콘텐츠 포함
        </label>

        <label className="flex items-center gap-2">
          <span className="text-white/50">언어</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-white outline-none focus:border-amber-400/60 cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value} className="bg-zinc-900">
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </form>
  );
}

export default memo(SearchBar);
