import { useTheme } from './context/ThemeContext';

function App() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    /* bg-white: 기본 배경은 하얀색
      dark:bg-slate-900: 다크모드일 때는 어두운 남색 
      transition-colors: 색이 바뀔 때 부드럽게 애니메이션 적용
    */
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500 bg-white dark:bg-slate-900">
      
      <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">
        {isDarkMode ? '🌙 다크 모드' : '☀️ 라이트 모드'}
      </h1>

      <button
        onClick={toggleTheme}
        className="px-8 py-4 bg-orange-500 text-white rounded-full font-bold shadow-lg hover:scale-110 transition-transform active:scale-95"
      >
        모드 전환하기
      </button>

      <p className="mt-6 text-gray-500 dark:text-gray-400">
        버튼을 눌러 테마를 바꿔보세요!
      </p>
    </div>
  );
}

export default App;