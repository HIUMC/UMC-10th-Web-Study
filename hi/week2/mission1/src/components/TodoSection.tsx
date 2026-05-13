import { useTodo } from '../context/TodoContext';
import TodoItem from './TodoItem';

interface TodoSectionProps {
  title: string;
  isDone: boolean;
}

const TodoSection = ({ title, isDone }: TodoSectionProps) => {
  const { todos, doneTodos } = useTodo();
  const targetTodos = isDone ? doneTodos : todos;

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul className="render-container__list">
        {targetTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} isDone={isDone} />
        ))}
      </ul>
    </div>
  );
};

export default TodoSection;