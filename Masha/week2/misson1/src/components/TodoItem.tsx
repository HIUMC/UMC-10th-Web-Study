import { useTodo } from '../context/TodoContext';
import type { Todo } from '../context/TodoContext'; // Todo 앞에 type 추가!

const TodoItem = ({ todo }: { todo: Todo }) => {
  const { toggleTodo, deleteTodo } = useTodo();

  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{todo.text}</span>
      <button
        className="render-container__item-button"
        // 완료 상태면 빨간색(삭제), 미완료면 초록색(완료)
        style={{ backgroundColor: todo.isDone ? '#dc3545' : '#28a745' }}
        onClick={() => (todo.isDone ? deleteTodo(todo.id) : toggleTodo(todo.id))}
      >
        {todo.isDone ? '삭제' : '완료'}
      </button>
    </li>
  );
};

export default TodoItem;