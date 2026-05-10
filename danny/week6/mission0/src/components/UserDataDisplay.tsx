import { useState } from "react";
import { useCustomFetch } from "../hooks/useCustomFetch";

interface WelcomeData {
  id: number;
  name: string;
  email: string;
}

export const WelcomeDataComponent = () => {
  const [userId, setUserId] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleChangeUser = (): void => {
    setUserId((prev) => {
      let randomId = prev;
      while (randomId === prev) {
        randomId = Math.floor(Math.random() * 10) + 1;
      }
      return randomId;
    });
  };

  const handleTestRetry = (): void => {
    setUserId(999999);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          position: "fixed",
          top: 0,
          right: 0,
          background: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          borderBottomLeftRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <button onClick={handleChangeUser}>다른 사용자 불러오기</button>
        <button onClick={(): void => setIsVisible(!isVisible)}>
          컴포넌트 토글 (언마운트 테스트)
        </button>
        <button
          onClick={handleTestRetry}
          style={{
            background: "#ff9800",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          재시도 테스트 (404 에러)
        </button>
      </div>

      <div style={{ marginTop: "70px" }}>
        {isVisible && <UserDataDisplay userId={userId} />}
      </div>
    </div>
  );
};

const UserDataDisplay = ({ userId }: { userId: number }) => {
  const { data, isPending, isError } = useCustomFetch<WelcomeData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );

  if (isError) {
    return <div>Error Occurred (User ID: {userId})</div>;
  }

  if (isPending && !data) {
    return <div>Loading... (User ID: {userId})</div>;
  }

  return (
    <div>
      {isPending && (
        <span style={{ fontSize: "12px", color: "gray" }}>
          데이터 갱신 중...
        </span>
      )}
      <h2>{data?.name}</h2>
      <p>{data?.email}</p>
      <p>ID: {data?.id}</p>
    </div>
  );
};
