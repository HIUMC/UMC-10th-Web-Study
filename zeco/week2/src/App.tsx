import { useState } from 'react';
import '../style.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import DoneList from './components/DoneList';

export type Task = {
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

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">ZECO TODO</h1>

      <TodoForm input={input} setInput={setInput} addTodo={addTodo} />

      <div className="render-container">
        <TodoList todos={todos} completeTask={completeTask} />
        <DoneList doneTasks={doneTasks} deleteTask={deleteTask} />
      </div>
    </div>
  );
}

export default App;
