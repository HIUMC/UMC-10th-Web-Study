import { useState } from "react";
import { useTodo } from "../context/TodoContext";

const TodoForm = () => {
  const [input, setInput] = useState("");
  const { addTodo } = useTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    addTodo(trimmed);
    setInput("");
  };

  return (
    <form className="todo-container__form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-container__input"
        placeholder="할 일 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="todo-container__button">
        할 일 추가
      </button>
    </form>
  );
};

export default TodoForm;
