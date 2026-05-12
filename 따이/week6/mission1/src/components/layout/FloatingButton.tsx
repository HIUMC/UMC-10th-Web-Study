import { useNavigate } from "react-router-dom";

const FloatingButton = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/lp/new")}
      aria-label="새 LP 작성"
      className="fixed right-6 bottom-6 z-20 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-pink-500 text-3xl font-bold text-white shadow-lg transition-colors hover:bg-pink-600"
    >
      +
    </button>
  );
};

export default FloatingButton;
