import TaskItem from './TaskItem';
import type { Task } from '../App';

type DoneListProps = {
  doneTasks: Task[];
  deleteTask: (task: Task) => void;
};

function DoneList({ doneTasks, deleteTask }: DoneListProps) {
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">완료</h2>
      <ul className="render-container__list">
        {doneTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            buttonText="삭제"
            onClick={deleteTask}
            buttonColor="#dc3545"
          />
        ))}
      </ul>
    </div>
  );
}

export default DoneList;
