import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="min-h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="max-w-3xl text-center">
        <p className="mb-4 text-sm tracking-[0.4em] text-pink-400">
          VINYL ARCHIVE
        </p>

        <h1 className="text-7xl md:text-9xl font-black text-pink-500 mb-8">
          3.33
        </h1>

        <h2 className="text-2xl md:text-4xl font-black mb-6">
          LP의 회전 속도에서 가져온 이름
        </h2>

        <p className="text-slate-300 leading-8 mb-4">
          LP는 보통 1분에 약 33과 1/3번 회전합니다.  
          이 속도에서 착안해 사이트 이름을 <strong>3.33</strong>으로 정했습니다.
        </p>

        <p className="text-slate-400 leading-8 mb-10">
          이곳은 좋아하는 LP를 등록하고, 둘러보고, 취향을 기록하는 작은
          아카이브입니다. 음악을 듣는 속도처럼 천천히, 하지만 분명하게
          취향을 쌓아갈 수 있도록 만들었습니다.
        </p>

        <Link
          to="/lps"
          className="inline-block px-7 py-4 rounded-xl bg-pink-500 font-bold hover:bg-pink-600 transition"
        >
          LP 둘러보기
        </Link>
      </div>
    </section>
  );
}