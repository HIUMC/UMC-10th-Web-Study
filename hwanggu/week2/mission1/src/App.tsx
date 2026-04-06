import { TodoProvider } from "./context/TodoContext";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import "./App.css";

export default function App() {
  return (
    <TodoProvider>
      <div className="todo-container">
        <h1 className="todo-container__header">TO DO LIST</h1>
        <TodoInput />
        <TodoList />
      </div>
    </TodoProvider>
  );
}