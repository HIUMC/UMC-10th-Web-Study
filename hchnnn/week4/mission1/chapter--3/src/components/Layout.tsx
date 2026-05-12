import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet /> {/* 여기에 MoviePage 등이 렌더링됨 */}
            </main>
        </div>
    );
}