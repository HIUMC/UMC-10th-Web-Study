import './App.css'
import Todo from './components/Todo' // 1. Todo 부품을 가져옵니다.

function App() {
  return (
    <>
      {/* 2. 기존의 <h1>Hello React</h1> 대신 <Todo />를 넣어줍니다. */}
      <Todo />
    </>
  )
}

export default App