import { memo } from "react";

interface SearchFormProps {
  query: string;
  onQueryChange: (v: string) => void;
  includeAdult: boolean;
  onAdultChange: (v: boolean) => void;
  language: string;
  onLanguageChange: (v: string) => void;
  onSubmit: () => void;
}

const SearchForm = memo(function SearchForm({
  query,
  onQueryChange,
  includeAdult,
  onAdultChange,
  language,
  onLanguageChange,
  onSubmit,
}: SearchFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-6 mb-8"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-500 text-sm mb-2">
            🎬 영화 제목
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="영화 제목을 입력하세요"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-500 text-sm mb-2">⚙️ 옵션</label>
          <label className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => onAdultChange(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            성인 콘텐츠 표시
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-gray-500 text-sm mb-2 text-center">
          🌐 언어
        </label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ko-KR">한국어</option>
            <option value="en-US">영어</option>
            <option value="ja-JP">일본어</option>
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            ▾
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium transition-colors"
      >
        🔍 검색하기
      </button>
    </form>
  );
});

export default SearchForm;
