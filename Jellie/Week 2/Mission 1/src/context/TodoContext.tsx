import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Todo } from '../types/todo';

type TodoContextType = {
  inputValue: string;
  todos: Todo[];
  setInputValue: (value: string) => void;
  addTodo: () => void;
  completeTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

type TodoProviderProps = {
  children: ReactNode;
};

export function TodoProvider({ children }: TodoProviderProps) {
  const [inputValue, setInputValueState] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const setInputValue = function (value: string) {
    setInputValueState(value);
  };

  const addTodo = function () {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      return;
    }

    const isDuplicate = todos.some(function (todo) {
      return todo.text === trimmedValue;
    });

    if (isDuplicate) {
      alert('중복된 항목입니다.');
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: trimmedValue,
      isDone: false,
    };

    setTodos(function (prevTodos) {
      return [...prevTodos, newTodo];
    });

    setInputValueState('');
  };

  const completeTodo = function (id: number) {
    setTodos(function (prevTodos) {
      return prevTodos.map(function (todo) {
        if (todo.id === id) {
          return { ...todo, isDone: true };
        }
        return todo;
      });
    });
  };

  const deleteTodo = function (id: number) {
    setTodos(function (prevTodos) {
      return prevTodos.filter(function (todo) {
        return todo.id !== id;
      });
    });
  };

  return (
    <TodoContext.Provider
      value={{
        inputValue,
        todos,
        setInputValue,
        addTodo,
        completeTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodoContext() {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodoContext must be used within TodoProvider');
  }

  return context;
}