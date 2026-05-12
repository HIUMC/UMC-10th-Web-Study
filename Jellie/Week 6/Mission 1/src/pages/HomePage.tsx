import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="min-h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="max-w-3xl text-center rounded-[2rem] bg-[#1a1f24]/62 backdrop-blur-md border border-[#e8ded4]/15 px-8 py-12 shadow-2xl shadow-black/45">
        <p className="mb-4 text-sm tracking-[0.45em] text-[#9fbfc2]">
          ANALOG VINYL ARCHIVE
        </p>

        <h1 className="text-7xl md:text-9xl font-black text-[#3fafc0] mb-8 drop-shadow">
          3.33
        </h1>

        <h2 className="text-2xl md:text-4xl font-black mb-6 text-[#e8ded4]">
          LP의 회전 속도에서 가져온 이름
        </h2>

        <p className="text-[#e8ded4] leading-8 mb-4">
          LP는 보통 1분에 약 33과 1/3번 회전합니다. 이 속도에서 착안해
          사이트 이름을 <strong className="text-[#5bc3d4]">3.33</strong>으로
          정했습니다.
        </p>

        <p className="text-[#c8c2b0] leading-8 mb-10">
          청록빛 물결과 낡은 종이 질감처럼, 음악도 시간이 쌓일수록 더 깊어집니다.
          이곳은 좋아하는 LP를 등록하고, 둘러보고, 취향을 천천히 기록하는 아카이브입니다.
        </p>

        <Link
          to="/lps"
          className="inline-block px-7 py-4 rounded-full bg-[#3fafc0] text-[#0f1720] font-bold hover:bg-[#5bc3d4] transition shadow-lg shadow-black/35"
        >
          LP 둘러보기
        </Link>
      </div>
    </section>
  );
}