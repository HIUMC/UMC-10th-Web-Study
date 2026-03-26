import TaskItem from './TaskItem';
import type { Task } from '../App';

type TodoListProps = {
  todos: Task[];
  completeTask: (task: Task) => void;
};

function TodoList({ todos, completeTask }: TodoListProps) {
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">할 일</h2>
      <ul className="render-container__list">
        {todos.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            buttonText="완료"
            onClick={completeTask}
            buttonColor="#28a745"
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
