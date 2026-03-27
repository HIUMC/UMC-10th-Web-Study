import { useTodo } from '../context/TodoContext';
import type { Todo } from '../context/TodoContext'; // 여기서도 Todo 앞에 type 추가
import TodoItem from './TodoItem';

const TodoList = () => {
  const { todos } = useTodo();

  // 비즈니스 로직: 완료 여부에 따라 분류 (백엔드의 Filter 기능과 유사)
  const activeTodos = todos.filter((task: Todo) => !task.isDone);
  const doneTodos = todos.filter((task: Todo) => task.isDone);

  return (
    <div className="render-container">
      {/* 할 일 섹션 */}
      <div className="render-container__section">
        <h2 className="render-container__title">할 일</h2>
        <ul className="render-container__list">
          {activeTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </div>

      {/* 완료 섹션 */}
      <div className="render-container__section">
        <h2 className="render-container__title">완료</h2>
        <ul className="render-container__list">
          {doneTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;