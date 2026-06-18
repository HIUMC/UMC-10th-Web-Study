import { memo, useCallback } from "react";
import Input from "./Input";
import LanguageSelector from "./LanguageSelector";
import type { LanguageValue } from "../constants/movie";

interface MovieFilterProps {
  query: string;
  includeAdult: boolean;
  language: LanguageValue;
  onQueryChange: (v: string) => void;
  onAdultChange: (v: boolean) => void;
  onLanguageChange: (v: LanguageValue) => void;
  onSearch: () => void;
}

const MovieFilter = memo(
  ({
    query,
    includeAdult,
    language,
    onQueryChange,
    onAdultChange,
    onLanguageChange,
    onSearch,
  }: MovieFilterProps) => {
    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        onSearch();
      },
      [onSearch],
    );

    return (
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="영화 제목"
              value={query}
              onChange={onQueryChange}
              placeholder="영화 제목을 입력하세요"
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                ⚙️ 옵션
              </label>
              <label
                className="flex items-center gap-3 px-4 py-2.5 bg-gray-800 border border-gray-600
                              rounded-lg cursor-pointer hover:border-gray-500 transition-colors h-[42px]"
              >
                <input
                  type="checkbox"
                  checked={includeAdult}
                  onChange={(e) => onAdultChange(e.target.checked)}
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-300">성인 콘텐츠 표시</span>
              </label>
            </div>
          </div>

          <LanguageSelector value={language} onChange={onLanguageChange} />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700
                     text-white font-semibold rounded-lg transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            🔍 검색하기
          </button>
        </div>
      </form>
    );
  },
);

MovieFilter.displayName = "MovieFilter";
export default MovieFilter;
