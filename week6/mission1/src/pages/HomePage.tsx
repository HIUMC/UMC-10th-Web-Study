import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { PAGINATION_ORDER } from "../enums/common";
import useGetLpList from "../hooks/queries/useGetLpList";
import { formatRelativeTime } from "../utils/formatDate";

const HomePage = () => {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);

  const { data, isLoading, isError } = useGetLpList({
    cursor: 0,
    limit: 10,
    order,
  });

  const lps = data?.data.data ?? [];

  if (isLoading) {
    return (
      <section className="min-h-full bg-black px-6 py-10">
        <p className="text-gray-400">LP 목록을 불러오는 중입니다.</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-full bg-black px-6 py-10">
        <p className="text-red-400">LP 목록을 불러오지 못했습니다.</p>
      </section>
    );
  }

  return (
    <section className="min-h-full bg-black px-6 py-10 text-white">
      <div className="mx-auto mb-10 flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">LP 목록</h1>

        <div className="flex w-fit overflow-hidden rounded-md border border-white">
          <button
            type="button"
            onClick={() => setOrder(PAGINATION_ORDER.DESC)}
            className={`px-5 py-2 text-sm font-bold transition-colors ${
              order === PAGINATION_ORDER.DESC
                ? "bg-white text-black"
                : "bg-black text-white hover:bg-white/10"
            }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => setOrder(PAGINATION_ORDER.ASC)}
            className={`border-l border-white px-5 py-2 text-sm font-bold transition-colors ${
              order === PAGINATION_ORDER.ASC
                ? "bg-white text-black"
                : "bg-black text-white hover:bg-white/10"
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      {lps.length === 0 ? (
        <p className="mx-auto max-w-7xl text-gray-400">등록된 LP가 없습니다.</p>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {lps.map((lp) => (
            <Link
              key={lp.id}
              to={`/lps/${lp.id}`}
              className="group relative aspect-square overflow-hidden bg-zinc-900 outline-none transition-transform duration-300 hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:scale-110"
            >
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110"
              />

              <div className="absolute inset-0 flex flex-col justify-end bg-black/70 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <h2 className="line-clamp-2 text-xl font-extrabold leading-tight text-white">
                  {lp.title}
                </h2>
                <div className="mt-4 flex items-center justify-between text-lg font-bold text-white">
                  <span>{formatRelativeTime(lp.createdAt)}</span>
                  <span className="flex items-center gap-1">
                    <Heart size={18} fill="currentColor" />
                    {lp.likes.length}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        to="/lp/create"
        aria-label="LP 등록"
        className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff1493] text-white shadow-lg transition-colors hover:bg-[#e80f84] focus:outline-none focus:ring-2 focus:ring-[#ff1493] focus:ring-offset-2"
      >
        <Plus size={26} strokeWidth={3} />
      </Link>
    </section>
  );
};

export default HomePage;
