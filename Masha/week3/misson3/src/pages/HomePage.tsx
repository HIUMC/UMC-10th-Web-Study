// src/pages/HomePage.tsx
import { NavLink } from 'react-router-dom'

const LINKS = [
    {to: '/', label: '홈'},
    {to: '/movies/popular',label: '인기 영화'},
    {to:'/movies/now_playing', label: '상영 중'},
    {to: '/movies/top_rated', label: '평점 높은 영화'},
]

// 👇 여기 이름을 Navbar에서 HomePage로 바꿉니다!
export const HomePage = () => {
    return (
    <div className="flex gap-3 p-4">
        {LINKS.map(({to, label}) => (
            <NavLink key={to} to={to} className={({isActive}) => {
                return isActive ? 'font-bold' : 'text-gray-500'
            }}>
                {label}
            </NavLink>
        ))}
    </div>
    )
}