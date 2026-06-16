import { useState, memo, FormEvent } from "react";

import Input from "#/components/Input";
import LanguageSelector from "#/components/LanguageSelector";
import SelectBox from "#/components/SelectBox";
import { LANGUAGE_OPTIONS } from "#/constants/movie";
import { MovieFilters, Language } from "../types/movie"; //

interface MovieFilterProps {
  onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps): Element => {
  console.log("MovieFilter 랜더링됨");

  const [query, setQuery] = useState<string>("");
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>("ko-KR");

  // 미션 요구사항: form 제출 및 엔터키 검색 대응
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault(); // 페이지 새로고침 방지
    const filters: MovieFilters = {
      query,
      include_adult: includeAdult,
      language,
    };
    onChange(filters);
  };

  return (
    // 미션 요구사항: 전체를 form 태그로 감싸기
    <form 
      onSubmit={handleSubmit} 
      className="transform space-y-6 rounded-2xl border border-gray-300 bg-white p-6 shadow-xl transition-all hover:shadow-2xl mb-8"
    >
      <div className="flex flex-wrap gap-6">
        {/* 영화 제목 입력 구역 */}
        <div className="min-w-[450px] flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            🎬 영화 제목
          </label>
          <Input value={query} onChange={setQuery} />
        </div>

        {/* 성인 콘텐츠 옵션 구역 */}
        <div className="min-w-[250px] flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            💣 옵션
          </label>
          <SelectBox
            checked={includeAdult}
            onChange={setIncludeAdult}
            label="성인 콘텐츠 표시"
            id="include_adult"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 언어 선택 구역 */}
        <div className="min-w-[250px] flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            💰 언어
          </label>
          <LanguageSelector
            value={language}
            // 이벤트를 Language 타입으로 명시적으로 맞추어 컴포넌트 간의 타입 에러(빨간 줄) 완전 해결
            onChange={(val: string): void => setLanguage(val as Language)}
            options={LANGUAGE_OPTIONS}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm"
          />
        </div>
      </div>

      {/* 하단 검색 버튼 구역 */}
      <div className="pt-4">
        {/* type="submit"으로 지정하여 엔터키 작동 보장 */}
        <button 
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
        >
          🔍 검색하기
        </button>
      </div>
    </form>
  );
};

// 미션 요구사항: 불필요한 상위 리렌더링 전파를 막기 위해 memo 필수 적용
export default memo(MovieFilter);