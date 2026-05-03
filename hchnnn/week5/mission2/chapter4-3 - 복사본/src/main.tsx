import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // 이 줄이 Tailwind가 들어있는 index.css를 불러오는 핵심입니다.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)