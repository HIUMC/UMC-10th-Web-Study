import { useState } from 'react'
import useCustomFetch from './hooks/useCustomFetch'

function App() {
  const [id, setId] = useState(1)

  const { data, isLoading, isError } = useCustomFetch({
    queryKey: ['todo', id],
    url: `https://jsonplaceholder.typicode.com/todos/${id}`,
    retry: 3,
    staleTime: 5000
  })

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러 발생!</div>

  return (
    <div>
      <button onClick={() => setId(1)}>todo 1</button>
      <button onClick={() => setId(2)}>todo 2</button>
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}

export default App