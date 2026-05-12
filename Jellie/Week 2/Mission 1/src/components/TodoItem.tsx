import type { Todo } from '../types/todo';
import { useTodoContext } from '../context/TodoContext';

type TodoItemProps = {
  todo: Todo;
};

export default function TodoItem({ todo }: TodoItemProps) {
  const { completeTodo, deleteTodo } = useTodoContext();

  const itemClassName = todo.isDone ? 'todo-item todo-item--done' : 'todo-item';

  return (
    <li className={itemClassName}>
      <span className="todo-item__text">{todo.text}</span>
      <div className="todo-item__actions">
        {todo.isDone ? (
          <button
            type="button"
            className="todo-item__button todo-item__button--delete"
            onClick={function () {
              deleteTodo(todo.id);
            }}
          >
            삭제
          </button>
        ) : (
          <button
            type="button"
            className="todo-item__button todo-item__button--complete"
            onClick={function () {
              completeTodo(todo.id);
            }}
          >
            완료
          </button>
        )}
      </div>
    </li>
  );
}