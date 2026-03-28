import { createContext, useContext ,useState } from 'react';
import type {PropsWithChildren} from 'react';
import type { TTodo } from '../components/types/todo';

interface ITodoContext {
    todos: TTodo[];
    doneTodos: TTodo[];
    addTodo: (text: string) => void;
    completeTodo: (todo: TTodo) => void;
    deleteTodo: (todo: TTodo) => void;

}

const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children } : PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

    const addTodo = (text: string) => {
        const newTodo : TTodo = { id: Date.now(), text};
        setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
    };

    const completeTodo = (todo : TTodo) => {
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        setDoneTodos((prevDoneTodos) : TTodo[] => [...prevDoneTodos,todo]);

    };

    const deleteTodo = (todo: TTodo) => {
        setDoneTodos((prevDoneTodo): TTodo[] => prevDoneTodo.filter((t) => t.id !== todo.id))
    };

    return <TodoContext.Provider value={{todos, doneTodos, addTodo, completeTodo,deleteTodo}}>{children}</TodoContext.Provider>

};

export default TodoContext;

export const useTodo = () => {
    const context = useContext(TodoContext);
    if(!context) {
        throw new Error(
            'Provider 필요'
        );
    }

    return context;
}