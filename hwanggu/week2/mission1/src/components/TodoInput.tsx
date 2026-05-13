import { useTodo } from "../context/TodoContext";

export default function TodoInput() {
  const { inputValue, setInputValue, addTodo } = useTodo();

  return (
    <form
      className="todo-container__form"
      onSubmit={(e) => { e.preventDefault(); addTodo(); }}
    >
      <input
        type="text"
        className="todo-container__input"
        placeholder="할 일 입력"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        required
      />
      <button type="submit" className="todo-container__button">
        할 일 추가
      </button>
    </form>
  );
}