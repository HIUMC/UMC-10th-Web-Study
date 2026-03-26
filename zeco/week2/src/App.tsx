import { useState } from 'react';
import '../style.css';

type Task = {
  id: number;
  text: string;
};

function App() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  const addTodo = () => {
    if (!input.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: input,
    };

    setTodos([...todos, newTask]);
    setInput('');
  };

  const completeTask = (task: Task) => {
    setTodos(todos.filter((t) => t.id !== task.id));
    setDoneTasks([...doneTasks, task]);
  };

  const deleteTask = (task: Task) => {
    setDoneTasks(doneTasks.filter((t) => t.id !== task.id));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">ZECO TODO</h1>

      <form className="todo-container__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="todo-container__input"
          placeholder="할 일 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button type="submit" className="todo-container__button">
          할 일 추가
        </button>
      </form>

      <div className="render-container">
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul className="render-container__list">
            {todos.map((task) => (
              <li key={task.id} className="render-container__item">
                <span className="render-container__item-text">{task.text}</span>
                <button
                  type="button"
                  className="render-container__item-button"
                  style={{ backgroundColor: '#28a745' }}
                  onClick={() => completeTask(task)}
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul className="render-container__list">
            {doneTasks.map((task) => (
              <li key={task.id} className="render-container__item">
                <span className="render-container__item-text">{task.text}</span>
                <button
                  type="button"
                  className="render-container__item-button"
                  style={{ backgroundColor: '#dc3545' }}
                  onClick={() => deleteTask(task)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
