import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Todo } from "../types/Todo";
type TodoContextType = {
  todos: Todo[];
  addTodo: (text: string) => void;
  completeTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
};

const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, isDone: false }]);
  };

  const completeTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isDone: true } : todo)),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, completeTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodo must be used within TodoProvider");
  return context;
};
