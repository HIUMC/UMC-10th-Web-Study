import { useState } from 'react';
import { useTodo } from '../context/TodoContext';

const TodoInput = () => {
  const [text, setText] = useState('');
  const { addTodo } = useTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo(text);
    setText('');
  };

  return (
    <form className="todo-container__form" onSubmit={handleSubmit}>
      <input
        className="todo-container__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일 입력"
      />
      <button type="submit" className="todo-container__button">할 일 추가</button>
    </form>
  );
};

export default TodoInput;