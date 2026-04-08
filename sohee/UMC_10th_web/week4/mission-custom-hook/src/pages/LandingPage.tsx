import { Link } from 'react-router-dom';
import { movieCategories } from '../lib/tmdb';

const LandingPage = () => {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <div className="rounded-[36px] border border-white/10 bg-white/6 px-6 py-10 shadow-[0_30px_100px_rgba(15,23,42,0.32)] md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.38em] text-amber-300">
          Mission 1
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
          Custom Hook으로
          <br />
          영화 데이터를 불러와요
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
          목록 페이지와 상세 페이지 모두 같은 `useCustomFetch` 훅으로 데이터,
          로딩, 에러를 일원화한 영화 앱입니다. 아래 카테고리 중 하나를 눌러서
          바로 확인해 보세요.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {movieCategories.map(({ key, label }) => (
            <Link
              key={key}
              to={`/movies/${key}`}
              className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <aside className="rounded-[36px] border border-white/10 bg-gradient-to-br from-amber-300/15 via-fuchsia-300/10 to-sky-300/10 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.32)]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">
            Checklist
          </p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
            <li>커스텀 훅에서 데이터, 로딩, 에러를 함께 반환</li>
            <li>카테고리와 페이지가 바뀌면 자동 재요청</li>
            <li>상세 페이지도 동일한 패턴으로 재사용</li>
            <li>Tailwind CSS로 시각적인 완성도까지 챙기기</li>
          </ul>
        </div>
      </aside>
    </section>
  );
};

export default LandingPage;
