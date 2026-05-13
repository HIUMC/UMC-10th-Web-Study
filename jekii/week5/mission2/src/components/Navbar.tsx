import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <nav className="absolute top-0 w-full flex justify-between items-center p-5 z-10">
        <div
          className="text-pink-500 font-extrabold text-xl tracking-tighter cursor-pointer"
          onClick={() => navigate("/")}
        >
          돌려돌려LP판
        </div>
        <div className="flex gap-2">
          <button
            className="w-20 py-2.5 text-xs font-semibold bg-[#222] hover:bg-[#333] transition-colors rounded-md text-gray-300"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
          <button
            className="w-20 py-2.5 text-xs bg-pink-500 hover:bg-pink-600 transition-colors text-white rounded-md font-semibold"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
