import { useNavigate } from "react-router-dom";

const FloatingButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/lp/create")}
      className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl font-bold text-white shadow-lg shadow-pink-500/40 transition hover:bg-pink-600"
      aria-label="LP 작성하기"
    >
      +
    </button>
  );
};

export default FloatingButton;