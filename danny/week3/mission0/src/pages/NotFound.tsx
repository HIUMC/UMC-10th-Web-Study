import { useCurrentPath } from "../router";

const NotFound = () => {
  const path = useCurrentPath();
  return (
    <div>
      <h1>404 페이지</h1>
      <p>현재 경로: {path}</p>
    </div>
  );
};

export default NotFound;
