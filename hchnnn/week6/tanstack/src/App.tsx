import "./App.css";
import { useCustomFetch } from "./hooks/useCustomFetch";

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const { data, isPending, isError } = useCustomFetch<User>(
    "https://jsonplaceholder.typicode.com/users/1",
  );

  if (isError) {
    return <div>Error</div>;
  }
  if (isPending) {
    return <div>Loading</div>;
  }

  return (
  <div style={{ padding: '20px' }}>
    <h1>Query</h1>
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      {/* 정상적인 데이터 새로고침 (캐싱 확인용) */}
      <button onClick={() => window.location.reload()}>새로고침 (캐시 확인)</button>
      
      {/* 일부러 틀린 주소로 요청보내기 (재시도 확인용) */}
      <button onClick={() => {
        // 존재하지 않는 id인 11번을 호출하게 하여 404 에러 유도
        window.location.href = window.location.origin + '?id=11';
      }}>재시도 테스트 (404 에러)</button>
    </div>
    
    {data?.name}
  </div>
);
}

export default App;