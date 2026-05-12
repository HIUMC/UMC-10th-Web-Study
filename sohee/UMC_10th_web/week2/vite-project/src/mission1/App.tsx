import { TodoProvider } from './context/TodoProvider';
import TodoInput from './components/TodoInput';
import TodoLists from './components/TodoLists';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <div className="todo-container">
        <h1 className="todo-container__header">YONG TODO</h1>
        <TodoInput />
        <TodoLists />
      </div>
    </TodoProvider>
  );
}

export default App;