import { Link } from 'react-router-dom';
import { movieCategories } from '../lib/tmdb';

const StartPage = () => {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <div className="rounded-[36px] border border-white/10 bg-white/6 px-6 py-10 shadow-[0_30px_100px_rgba(15,23,42,0.32)] md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.38em] text-amber-300">
          Week 4 Mission
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
          영화 취향을 기록하고
          <br />
          회원가입 플로우까지
          <br />
          한 번에 완성해보세요
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
          이번 화면에서는 영화 목록 탐색과 함께 로그인, 회원가입 폼을
          `react-hook-form`과 `zod`로 안정적으로 관리할 수 있도록 연결했습니다.
          단계별 유효성 검사와 로컬 스토리지 저장도 함께 확인해볼 수 있어요.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/10"
          >
            로그인하러 가기
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
          >
            회원가입 시작하기
          </Link>
        </div>
      </div>

      <aside className="rounded-[36px] border border-white/10 bg-gradient-to-br from-amber-300/15 via-orange-300/10 to-sky-300/10 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.32)]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">
            이번 구현 포인트
          </p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
            <li>이메일, 비밀번호, 닉네임을 단계별로 검증하는 회원가입 폼</li>
            <li>비밀번호 표시 토글과 버튼 활성화 상태 제어</li>
            <li>로그인과 회원가입 모두 `react-hook-form + zod`로 통일</li>
            <li>`useLocalStorage` 커스텀 훅으로 사용자 정보 저장</li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            {movieCategories.map(({ key, label }) => (
              <Link
                key={key}
                to={`/movies/${key}`}
                className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
};

export default StartPage;
