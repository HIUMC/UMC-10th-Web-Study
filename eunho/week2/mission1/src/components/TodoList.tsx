import { useTodo } from "../context/TodoContext";
import Todo from "./Todo";

const TodoList = () => {
  const { todos } = useTodo();

  const pending = todos.filter((t) => !t.isDone);
  const done = todos.filter((t) => t.isDone);

  return (
    <div className="render-container">
      <div className="render-container__section">
        <h2 className="render-container__title">할 일</h2>
        <ul className="render-container__list">
          {pending.map((todo) => (
            <Todo key={todo.id} todo={todo} />
          ))}
        </ul>
      </div>
      <div className="render-container__section">
        <h2 className="render-container__title">완료</h2>
        <ul className="render-container__list">
          {done.map((todo) => (
            <Todo key={todo.id} todo={todo} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
