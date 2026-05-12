// src/vite-env.d.ts 파일 생성 후 아래 내용 붙여넣기
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_API_URL: string;
  // 다른 환경 변수들에 대한 타입 정의...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
