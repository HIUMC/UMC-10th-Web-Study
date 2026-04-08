import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Home Page</h1>
      <Link to="/login" className="home-link">
        로그인 페이지로 이동
      </Link>
    </div>
  );
};

export default HomePage;