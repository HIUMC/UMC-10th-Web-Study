// misson2/postcss.config.js
export default {
  plugins: {
    // 기존에 'tailwindcss': {} 라고 되어 있던 부분을 아래로 교체!
    '@tailwindcss/postcss': {}, 
    'autoprefixer': {},
  },
}