import { Outlet } from "react-router-dom"
import { Navbar } from "../components/Navbar"

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <h1 className="text-white text-3xl p-10">환영합니다!</h1> 
            <Outlet />
        </div>
    )
}

export default HomePage