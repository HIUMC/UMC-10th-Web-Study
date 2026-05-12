/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ⭐ 이 설정이 있어야 다크모드가 작동합니다!
  theme: {
    extend: {},
  },
  plugins: [],
}