import { useState } from 'react';
import type { TTodo } from '../types/todo'; // React 19 권장 방식

const Todo = () => {
  // --- 상태 관리 (State) ---
  const [todos, setTodos] = useState<TTodo[]>([
    { id: 1, text: '맛있다.' },
  ]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([
    { id: 2, text: '오타니' },
  ]);
  const [input, setInput] = useState<string>('');

  // --- 함수 로직 (기능) ---

  // 1. 할 일 추가
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    if (!input.trim()) return;

    const newTodo: TTodo = {
      id: Date.now(),
      text: input,
    };
    setTodos([...todos, newTodo]);
    setInput(''); // 입력창 비우기
  };

  // 2. 완료 처리 (할 일 -> 완료 목록으로 이동)
  const completeTask = (task: TTodo) => {
    setTodos(todos.filter((t) => t.id !== task.id));
    setDoneTodos([...doneTodos, task]);
  };

  // 3. 삭제 처리 (완료 목록에서 영구 삭제)
  const deleteTask = (id: number) => {
    setDoneTodos(doneTodos.filter((t) => t.id !== id));
  };

  return (
    <div className='todo-container'>
      <h1 className='todo-container__header'>YONG TODO</h1>
      
      {/* 입력 폼 */}
      <form className='todo-container__form' onSubmit={addTodo}>
        <input
          type='text'
          className='todo-container__input'
          placeholder='할 일 입력'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button type='submit' className='todo-container__button'>
          할 일 추가
        </button>
      </form>

      <div className='render-container'>
        {/* 할 일 목록 섹션 */}
        <div className='render-container__section'>
          <h2 className='render-container__title'>할 일</h2>
          <ul className='render-container__list'>
            {todos.map((todo) => (
              <li key={todo.id} className='render-container__item'>
                <span className='render-container__item-text'>{todo.text}</span>
                <button
                  onClick={() => completeTask(todo)}
                  style={{ backgroundColor: '#28a745' }}
                  className='render-container__item-button'
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 완료 목록 섹션 */}
        <div className='render-container__section'>
          <h2 className='render-container__title'>완료</h2>
          <ul className='render-container__list'>
            {doneTodos.map((todo) => (
              <li key={todo.id} className='render-container__item'>
                <span className='render-container__item-text'>{todo.text}</span>
                <button
                  onClick={() => deleteTask(todo.id)}
                  style={{ backgroundColor: '#dc3545' }}
                  className='render-container__item-button'
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
};

export default Todo;