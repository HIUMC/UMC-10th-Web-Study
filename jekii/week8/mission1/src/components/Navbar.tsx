import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import useLogout from "../hooks/mutations/useLogout";
import useGetMyInfoQuery from "../hooks/queries/useGetMyInfoQuery";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const logoutMutation = useLogout();
  const { data } = useGetMyInfoQuery(!!accessToken);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <nav className="shrink-0 h-[72px] w-full flex justify-between items-center px-6 z-50 bg-white/50 dark:bg-[#1e1e24] border-b border-slate-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-800 dark:text-white hover:text-pink-600 dark:hover:text-pink-500 transition-colors"
          aria-label="Open menu"
        >
          <FiMenu size={28} />
        </button>

        <button
          type="button"
          className="text-pink-600 dark:text-pink-500 font-extrabold text-xl tracking-tighter hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          돌려돌려LP판
        </button>
      </div>

      <div className="flex items-center gap-4">
        {!accessToken ? (
          <>
            <button
              className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-[#2a2b36] hover:bg-slate-200 dark:hover:bg-[#32333f] text-slate-700 dark:text-gray-300 transition-colors rounded-lg"
              onClick={() => navigate("/login")}
            >
              로그인
            </button>
            <button
              className="px-4 py-2 text-sm font-medium bg-pink-600 hover:bg-pink-500 text-white transition-colors rounded-lg shadow-sm"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </>
        ) : (
          <>
            <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-gray-300 mr-2">
              <strong className="text-pink-600 dark:text-pink-400">
                {data?.data?.name}
              </strong>
              님 반갑습니다.
            </span>

            <button
              className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-[#2a2b36] hover:bg-slate-200 dark:hover:bg-[#32333f] text-slate-500 hover:text-pink-600 transition-colors rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "로그아웃 중" : "로그아웃"}
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
