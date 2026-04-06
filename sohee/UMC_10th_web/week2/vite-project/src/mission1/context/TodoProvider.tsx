import { useState, type ReactNode } from 'react';
import { TodoContext, type Task } from './TodoContext'; // Context 파일에서 가져옴

// ⭐ 이 줄 처음에 'export'가 반드시 있어야 합니다!
export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  const addTodo = (text: string) => 
    setTodos([...todos, { id: Date.now(), text }]);

  const completeTask = (task: Task) => {
    setTodos(todos.filter((t) => t.id !== task.id));
    setDoneTasks([...doneTasks, task]);
  };

  const deleteTask = (task: Task) => 
    setDoneTasks(doneTasks.filter((t) => t.id !== task.id));

  return (
    <TodoContext.Provider value={{ todos, doneTasks, addTodo, completeTask, deleteTask }}>
      {children}
    </TodoContext.Provider>
  );
};