import { useTheme } from "./context/ThemeContext";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          {theme === "light" ? "☀️ 라이트 모드" : "🌙 다크 모드"}
        </h1>
        <p className="text-gray-900 dark:text-gray-400">
          useContext로 전역 테마를 관리하고 있어요!
        </p>
        <button
          onClick={toggleTheme}
          className="px-6 py-3 rounded-full font-semibold
            bg-gray-900 text-white dark:bg-white dark:text-gray-900
            hover:opacity-80 transition-all duration-300"
        >
          {theme === "light" ? "🌙 다크모드로 전환" : "☀️ 라이트모드로 전환"}
        </button>
      </div>
    </div>
  );
}

export default App;
