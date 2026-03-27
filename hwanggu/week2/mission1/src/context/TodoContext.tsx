import { createContext, useContext, useState, ReactNode } from "react";

export type Task = {
  id: number;
  text: string;
};

type TodoContextType = {
  todos: Task[];
  doneTasks: Task[];
  inputValue: string;
  setInputValue: (value: string) => void;
  addTodo: () => void;
  completeTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
};

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const addTodo = (): void => {
    const text = inputValue.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: Date.now(), text }]);
    setInputValue("");
  };

  const completeTask = (task: Task): void => {
    setTodos((prev) => prev.filter((t) => t.id !== task.id));
    setDoneTasks((prev) => [...prev, task]);
  };

  const deleteTask = (task: Task): void => {
    setDoneTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  return (
    <TodoContext.Provider
      value={{ todos, doneTasks, inputValue, setInputValue, addTodo, completeTask, deleteTask }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo(): TodoContextType {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodo는 TodoProvider 안에서만 사용 가능합니다.");
  return context;
}