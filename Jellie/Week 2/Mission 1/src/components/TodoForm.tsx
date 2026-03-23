import { type FormEvent } from 'react';
import { useTodoContext } from '../context/TodoContext';

export default function TodoForm() {
  const { inputValue, setInputValue, addTodo } = useTodoContext();

  const handleSubmit = function (event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addTodo();
  };

  return (
    <form className="todo-card__input-box" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-card__input"
        placeholder="할 일 입력"
        value={inputValue}
        onChange={function (event) {
          setInputValue(event.target.value);
        }}
      />
      <button type="submit" className="todo-card__add-button">
        추가
      </button>
    </form>
  );
}