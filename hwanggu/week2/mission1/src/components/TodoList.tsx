import { useTodo } from "../context/TodoContext";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { todos, doneTasks, completeTask, deleteTask } = useTodo();

  return (
    <div className="render-container">
      <div className="render-container__section">
        <h2 className="render-container__title">할 일</h2>
        <ul className="render-container__list">
          {todos.map((task) => (
            <TodoItem key={task.id} task={task} isDone={false} onComplete={completeTask} />
          ))}
        </ul>
      </div>
      <div className="render-container__section">
        <h2 className="render-container__title">완료</h2>
        <ul className="render-container__list">
          {doneTasks.map((task) => (
            <TodoItem key={task.id} task={task} isDone={true} onDelete={deleteTask} />
          ))}
        </ul>
      </div>
    </div>
  );
}