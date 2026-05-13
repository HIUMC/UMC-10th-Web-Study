import { useTheme } from './context/ThemeContext';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-all duration-500 ${
      theme === 'DARK' ? 'bg-gray-900 text-white' : 'bg-white text-black'
    }`}>
      <h1 className="text-4xl font-bold mb-6 italic">
        {theme === 'LIGHT' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </h1>
      
      <button 
        onClick={toggleTheme}
        className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
      >
        테마 전환하기
      </button>
      
      <p className="mt-4 text-gray-500"></p>
    </div>
  );
}

export default App;