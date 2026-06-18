import { memo } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Language } from "../types/movie";

const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: "ko-KR", label: "한국어" },
  { code: "en-US", label: "영어" },
  { code: "ja-JP", label: "일본어" },
];

interface SearchFormProps {
  query: string;
  includeAdult: boolean;
  language: Language;
  onQueryChange: (value: string) => void;
  onAdultChange: (value: boolean) => void;
  onLanguageChange: (value: Language) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
}

function SearchForm({
  query,
  includeAdult,
  language,
  onQueryChange,
  onAdultChange,
  onLanguageChange,
  onSearch,
}: SearchFormProps) {
  console.log("🔴 SearchForm 렌더링");

  return (
    <form
      onSubmit={onSearch}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 영화 제목 입력 */}
        <div>
          <label className="block text-center text-gray-600 mb-2">
            🎬 영화 제목
          </label>
          <input
            type="text"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onQueryChange(e.target.value)
            }
            placeholder="영화 제목을 입력하세요"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 성인 콘텐츠 체크박스 */}
        <div>
          <label className="block text-center text-gray-600 mb-2">⚙️ 옵션</label>
          <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onAdultChange(e.target.checked)
              }
              className="w-4 h-4"
            />
            <span className="text-gray-700">성인 콘텐츠 표시</span>
          </label>
        </div>
      </div>

      {/* 언어 선택 */}
      <div className="mt-6">
        <label className="block text-center text-gray-600 mb-2">🌐 언어</label>
        <select
          value={language}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onLanguageChange(e.target.value as Language)
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 검색 버튼 */}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg mt-6 transition-colors"
      >
        🔍 검색하기
      </button>
    </form>
  );
}

export default memo(SearchForm);
