import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center p-12">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-[#272930] md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-500">
          404
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-500 dark:text-gray-400">
          주소가 잘못 입력되었거나, 요청하신 페이지가 이동 또는 삭제되었을 수
          있습니다.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-bold text-white transition-colors hover:bg-pink-500"
          >
            <FiHome />
            홈으로 이동
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-600 transition-colors hover:border-pink-300 hover:text-pink-500 dark:border-gray-800 dark:bg-[#1e1e24] dark:text-gray-300"
          >
            <FiArrowLeft />
            이전 페이지
          </button>
        </div>
      </section>
    </div>
  );
};

export default NotFoundPage;
