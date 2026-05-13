import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext'; // 1. 방금 만든 파일 불러오기

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider> {/* 2. App을 감싸주기 */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);