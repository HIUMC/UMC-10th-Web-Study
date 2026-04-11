import { useTodo,type Task } from '../context/TodoContext';

interface Props {
  task: Task;
  isDone: boolean;
}

const TodoItem = ({ task, isDone }: Props) => {
  const { completeTask, deleteTask } = useTodo();

  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{task.text}</span>
      <button
        className="render-container__item-button"
        onClick={() => isDone ? deleteTask(task) : completeTask(task)}
        style={{ backgroundColor: isDone ? '#dc3545' : '#28a745' }}
      >
        {isDone ? '삭제' : '완료'}
      </button>
    </li>
  );
};

export default TodoItem;