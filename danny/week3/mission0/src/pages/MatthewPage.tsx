import { useCurrentPath } from "../router";

const MatthewPage = () => {
  const path = useCurrentPath();
  return (
    <div>
      <h1>매튜 페이지</h1>
      <p>현재 경로: {path}</p>
    </div>
  );
};

export default MatthewPage;
