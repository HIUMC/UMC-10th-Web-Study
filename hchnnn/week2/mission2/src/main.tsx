import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext' // 추가

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider> {/* 우산 씌우기 */}
      <App />
    </ThemeProvider>
  </StrictMode>,
)