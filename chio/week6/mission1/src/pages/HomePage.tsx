import { useState } from "react";
import { Plus } from "lucide-react";
import useGetLpList from "../hooks/queries/useGetLpList";
import LpCard from "../components/LpCard";

function HomePage() {
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const { data, isPending, isError } = useGetLpList({ order: sort });

  const sortButtonClass = (value: "asc" | "desc") =>
    [
      "h-11 min-w-24 border border-white px-5 text-base font-bold transition-colors",
      sort === value
        ? "bg-white text-black"
        : "bg-black text-white hover:bg-zinc-900",
    ].join(" ");

  return (
    <section className="min-h-full bg-black px-6 py-8 text-white md:px-16 md:py-12">
      <div className="mb-6 flex justify-end">
        <div className="inline-flex overflow-hidden rounded-md">
          <button
            type="button"
            onClick={() => setSort("asc")}
            className={sortButtonClass("asc")}
          >
            오래된순
          </button>
          <button
            type="button"
            onClick={() => setSort("desc")}
            className={sortButtonClass("desc")}
          >
            최신순
          </button>
        </div>
      </div>

      {isPending && (
        <p className="text-center text-sm font-semibold text-zinc-400">
          LP 목록을 불러오는 중입니다.
        </p>
      )}

      {isError && (
        <p className="text-center text-sm font-semibold text-red-400">
          LP 목록을 불러오지 못했습니다.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {data?.data.data.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
      </div>

      <button
        type="button"
        aria-label="LP 추가"
        className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff1493] text-white shadow-lg shadow-black/30 transition-colors hover:bg-[#e80f84]"
      >
        <Plus size={34} strokeWidth={3} />
      </button>
    </section>
  );
}

export default HomePage;

/*
<div className="h-full flex flex-col justify-center items-center">
      <h1 className="text-6xl p-10">🌸환영합니다🌸</h1>
      <div className="text-lg w-60 text-center">
        <button className="text-gray-400 font-bold w-20 hover:cursor-pointer"
          onClick = {() => navigate("/login")}
        >
          로그인
        </button>
        <span className="text-gray-400 font-bold">{"/"}</span>
        <button className="text-gray-400 font-bold w-23 hover:cursor-pointer"
          onClick = {() => navigate("/signup")}
        >
          회원가입
        </button>      
      </div>      
    </div>
    */
