import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // 기존 React 플러그인
import tailwindcss from '@tailwindcss/vite' // 새로 추가한 Tailwind 플러그인

// 하나의 defineConfig 안에 두 플러그인을 모두 넣어줍니다.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})