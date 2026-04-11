import type { TTodo } from '../types/todo';
import { useTodo } from '../context/TodoContext';

interface TodoItemProps {
  todo: TTodo;
  isDone: boolean;
}

const TodoItem = ({ todo, isDone }: TodoItemProps) => {
  const { handleComplete, handleDelete } = useTodo();

  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{todo.text}</span>
      <button
        type="button"
        className={`render-container__item-button ${
          isDone ? 'delete-button' : 'complete-button'
        }`}
        onClick={() => (isDone ? handleDelete(todo) : handleComplete(todo))}
      >
        {isDone ? '삭제' : '완료'}
      </button>
    </li>
  );
};

export default TodoItem;