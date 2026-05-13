import { useCurrentPath } from "../router";

const AeongPage = () => {
  const path = useCurrentPath();
  return (
    <div>
      <h1>애옹 페이지</h1>
      <p>현재 경로: {path}</p>
    </div>
  );
};

export default AeongPage;
