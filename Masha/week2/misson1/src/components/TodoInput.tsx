import { useState } from 'react';
import { useTodo } from '../context/TodoContext';

const TodoInput = () => {
  const [text, setText] = useState('');
  const { addTodo } = useTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return; // 빈 값 입력 방지
    addTodo(text);            // Context의 추가 함수 호출
    setText('');              // 입력창 초기화
  };

  return (
    <form className="todo-container__form" onSubmit={handleSubmit}>
      <input
        className="todo-container__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <button className="todo-container__button" type="submit">
        할 일 추가
      </button>
    </form>
  );
};

export default TodoInput;