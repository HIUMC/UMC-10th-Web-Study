import type { Todo as TodoType } from "../types/Todo";
import { useTodo } from "../context/TodoContext";
type Props = {
  todo: TodoType;
};

const Todo = ({ todo }: Props) => {
  const { completeTodo, deleteTodo } = useTodo();

  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{todo.text}</span>
      {todo.isDone ? (
        <button
          className="render-container__item-button"
          style={{ backgroundColor: "#dc3545" }}
          onClick={() => deleteTodo(todo.id)}
        >
          삭제
        </button>
      ) : (
        <button
          className="render-container__item-button"
          style={{ backgroundColor: "#28a745" }}
          onClick={() => completeTodo(todo.id)}
        >
          완료
        </button>
      )}
    </li>
  );
};

export default Todo;
