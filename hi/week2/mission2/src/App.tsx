import Todo from './components/Todo';
import { ThemeProvider } from './context/ThemeContext';
import { TodoProvider } from './context/TodoContext';


function App() {
  return (
    <ThemeProvider>
     <TodoProvider>
      <Todo />
     </TodoProvider>
    </ThemeProvider>
  );
}

export default App;
