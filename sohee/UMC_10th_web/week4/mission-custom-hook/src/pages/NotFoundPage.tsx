import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-10 text-center shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">
          404
        </p>
        <h1 className="mt-4 text-4xl font-black">페이지를 찾을 수 없어요.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          주소가 잘못되었거나, 페이지가 이동되었을 수 있어요. 영화 목록으로 다시
          돌아가 볼까요?
        </p>
        <Link
          to="/movies/popular"
          className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
        >
          인기 영화 보러 가기
        </Link>
      </div>
    </div>
  );
}
