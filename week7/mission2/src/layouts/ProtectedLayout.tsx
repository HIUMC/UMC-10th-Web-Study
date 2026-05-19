import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContextValue";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!accessToken) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl">
          <h2 className="text-xl font-bold text-gray-900">로그인이 필요합니다.</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            LP 상세 페이지는 로그인 후 이용할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={() =>
              navigate("/login", {
                state: { from: location },
                replace: true,
              })
            }
            className="mt-6 w-full rounded-md bg-[#ff1493] px-4 py-3 font-bold text-white transition-colors hover:bg-[#e80f84]"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedLayout;
