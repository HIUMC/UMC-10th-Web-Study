import { useCurrentPath } from "../router";

const JoyPage = () => {
  const path = useCurrentPath();
  return (
    <div>
      <h1>조이 페이지</h1>
      <p>현재 경로: {path}</p>
    </div>
  );
};

export default JoyPage;
