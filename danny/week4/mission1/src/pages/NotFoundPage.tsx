import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]" />
      </div>

      <p className="text-[160px] md:text-[220px] font-black leading-none text-white/5 select-none">
        404
      </p>

      <div className="-mt-8 flex flex-col items-center gap-4">
        <p className="text-3xl md:text-4xl font-bold">
          페이지를 찾을 수 없습니다
        </p>
        <p className="text-white/40 text-base max-w-sm leading-relaxed">
          요청하신 페이지가 존재하지 않거나
          <br />
          다른 주소로 이동되었습니다.
        </p>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
          >
            ← 뒤로가기
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl bg-[#dda5e3] hover:bg-[#c98fd0] text-neutral-950 text-sm font-semibold transition-colors"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}
