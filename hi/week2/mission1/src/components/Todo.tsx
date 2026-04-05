import TodoForm from './TodoForm';
import TodoSection from './TodoSection';

const Todo = () => {
  return (
    <div className="todo-container">
      <h1 className="todo-container__header">YONG TODO</h1>
      <TodoForm />

      <div className="render-container">
        <TodoSection title="할 일" isDone={false} />
        <TodoSection title="완료" isDone={true} />
      </div>
    </div>
  );
};

export default Todo;