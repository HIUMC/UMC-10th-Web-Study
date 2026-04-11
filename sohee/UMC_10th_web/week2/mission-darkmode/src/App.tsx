import { ThemeProvider } from './context/ThemeProvider';
import { useTheme } from './context/ThemeContext';

const DarkModeCard = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    /* bg-white(라이트), dark:bg-gray-800(다크) */
    <div className="p-12 rounded-3xl shadow-2xl transition-all duration-500 
                    bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-black mb-6 text-center text-gray-900 dark:text-white">
        {theme === 'light' ? 'LIGHT MODE ☀️' : 'DARK MODE 🌙'}
      </h2>
      
      <p className="mb-8 text-center text-gray-600 dark:text-gray-400 font-medium">
        현재 상태: <span className="uppercase tracking-widest">{theme}</span>
      </p>
      
      <div className="flex justify-center">
        <button
          onClick={toggleTheme}
          className="px-10 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg
                     bg-indigo-600 text-white hover:bg-indigo-700 
                     dark:bg-yellow-400 dark:text-gray-900 dark:hover:bg-yellow-500"
        >
          {theme === 'light' ? '다크모드 켜기' : '라이트모드 켜기'}
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      {/* 화면 전체를 채우는 컨테이너 (bg-gray-100 -> dark:bg-gray-950) */}
      <div className="min-h-screen w-screen flex items-center justify-center transition-colors duration-500
                      bg-gray-100 dark:bg-gray-950 p-4">
        <DarkModeCard />
      </div>
    </ThemeProvider>
  );
}

export default App;