import { createContext, useContext, useState } from 'react';
import type { ReactNode, FormEvent } from 'react';
import type { TTodo } from '../types/todo';

interface TodoContextType {
  todos: TTodo[];
  doneTodos: TTodo[];
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleComplete: (todo: TTodo) => void;
  handleDelete: (todo: TTodo) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const newTodo: TTodo = {
      id: Date.now(),
      text: trimmedInput,
    };

    setTodos((prev) => [...prev, newTodo]);
    setInput('');
  };

  const handleComplete = (todo: TTodo) => {
    setTodos((prev) => prev.filter((item) => item.id !== todo.id));
    setDoneTodos((prev) => [...prev, todo]);
  };

  const handleDelete = (todo: TTodo) => {
    setDoneTodos((prev) => prev.filter((item) => item.id !== todo.id));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        doneTodos,
        input,
        setInput,
        handleSubmit,
        handleComplete,
        handleDelete,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodo는 TodoProvider 내부에서 사용되어야 합니다.');
  }

  return context;
};