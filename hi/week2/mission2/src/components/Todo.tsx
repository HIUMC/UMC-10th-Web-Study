import { useTheme } from '../context/ThemeContext';
import TodoForm from './TodoForm';
import TodoSection from './TodoSection';

const Todo = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app-wrapper ${theme}`}>
      <div className={`todo-container ${theme}`}>
        <div className="todo-header-row">
          <h1 className="todo-container__header">YONG TODO</h1>

          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? '다크모드' : '라이트모드'}
          </button>
        </div>

        <TodoForm />

        <div className="render-container">
          <TodoSection title="할 일" isDone={false} />
          <TodoSection title="완료" isDone={true} />
        </div>
      </div>
    </div>
  );
};

export default Todo;