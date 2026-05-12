import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MoviePage from './pages/MoviePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<div className="text-white p-10">홈 화면입니다.</div>} />
                    <Route path="movies/popular" element={<MoviePage category="popular" />} />
                    <Route path="movies/now-playing" element={<MoviePage category="now_playing" />} />
                    <Route path="movies/top-rated" element={<MoviePage category="top_rated" />} />
                    <Route path="movies/upcoming" element={<MoviePage category="upcoming" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;