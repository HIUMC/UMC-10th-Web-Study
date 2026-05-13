import { Link, Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div>
      <header>
        <Link to="/">홈</Link>{" "}
        <Link to="/login">로그인</Link>{" "}
        <Link to="/my">마이페이지</Link>
      </header>

      <hr />

      <Outlet />
    </div>
  );
}