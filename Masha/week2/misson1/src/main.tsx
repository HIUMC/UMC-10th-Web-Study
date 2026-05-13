import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TodoProvider } from './context/TodoContext'; // Context 불러오기

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* TodoProvider로 감싸야 전역 상태가 활성화됩니다! */}
    <TodoProvider>
      <App />
    </TodoProvider>
  </React.StrictMode>
);