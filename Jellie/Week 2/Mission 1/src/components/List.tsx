import { useTodoContext } from '../context/TodoContext';
import TodoItem from './TodoItem';

type ListProps = {
  title: string;
  isDone: boolean;
};

export default function List({ title, isDone }: ListProps) {
  const { todos } = useTodoContext();

  const filteredTodos = todos.filter(function (todo) {
    return todo.isDone === isDone;
  });

  return (
    <section className="todo-board__section">
      <h2 className="todo-board__title">{title}</h2>
      <ul className="todo-board__list">
        {filteredTodos.map(function (todo) {
          return <TodoItem key={todo.id} todo={todo} />;
        })}
      </ul>
    </section>
  );
}