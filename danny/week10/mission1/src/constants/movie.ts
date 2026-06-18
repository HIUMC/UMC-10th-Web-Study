export const LANGUAGE_OPTIONS = [
  { value: "ko-KR", label: "한국어" },
  { value: "en-US", label: "English" },
  { value: "ja-JP", label: "日本語" },
] as const;

export type LanguageValue = (typeof LANGUAGE_OPTIONS)[number]["value"];

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const POSTER_SIZE = "w500";
export const BACKDROP_SIZE = "w780";
