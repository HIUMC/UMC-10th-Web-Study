import './App.css'
import Todo from './components/Todo'
import TodoNew from './components/TodoNew'
import { TodoProvider } from './context/TodoContext';

function App() {
  

  return (
    <TodoProvider>
      <TodoNew />
    </TodoProvider>
  );
}

export default App;