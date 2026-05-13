import './App.css';
import TodoForm from './components/TodoForm';
import List from './components/List';

export default function App() {
  return (
    <main className="todo-app">
      <section className="todo-card">
        <h1 className="todo-card__title">To-Do List</h1>
        <TodoForm />
        <div className="todo-board">
          <List title="해야 할 일" isDone={false} />
          <List title="해낸 일" isDone={true} />
        </div>
      </section>
    </main>
  );
}