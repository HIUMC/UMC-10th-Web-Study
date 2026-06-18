/// <reference types="vite/client" />

// import.meta.env.VITE_TMDB_TOKEN 을 타입 안전하게 읽기 위한 선언
interface ImportMetaEnv {
  readonly VITE_TMDB_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}