import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLPList } from "../hooks/queries/useLP";

type OrderType = "popular" | "desc" | "asc";

export default function LPListPage() {
  const [order, setOrder] = useState<OrderType>("popular");
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const { data, isPending, isError, refetch } = useLPList({
    order,
    search,
    limit: 20,
  });

  const lps = data?.data ?? [];

  return (
    <section>
      <div className="mb-6 flex justify-end">
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setOrder("popular")}
            className={
              "px-4 py-2 rounded-lg border text-sm " +
              (order === "popular"
                ? "bg-white text-black"
                : "border-white/20 text-white")
            }
          >
            인기순
          </button>

          <button
            onClick={() => setOrder("desc")}
            className={
              "px-4 py-2 rounded-lg border text-sm " +
              (order === "desc"
                ? "bg-white text-black"
                : "border-white/20 text-white")
            }
          >
            최신순
          </button>

          <button
            onClick={() => setOrder("asc")}
            className={
              "px-4 py-2 rounded-lg border text-sm " +
              (order === "asc"
                ? "bg-white text-black"
                : "border-white/20 text-white")
            }
          >
            오래된순
          </button>
        </div>
      </div>

      {isPending && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded-xl bg-white/10 animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="py-20 text-center">
          <p className="mb-4 text-slate-300">LP 목록을 불러오지 못했습니다.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg bg-pink-500"
          >
            다시 시도
          </button>
        </div>
      )}

      {!isPending && !isError && lps.length === 0 && (
        <div className="py-20 text-center text-slate-400">
          등록된 LP가 없습니다.
        </div>
      )}

      {!isPending && !isError && lps.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {lps.map((lp) => (
            <Link
              key={lp.id}
              to={"/lp/" + lp.id}
              className="relative aspect-square overflow-hidden rounded-xl bg-white/10 group"
            >
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />

              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
                <h2 className="font-bold text-sm line-clamp-2">{lp.title}</h2>
                <p className="text-xs text-slate-300 mt-1">
                  업로드일 {new Date(lp.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-pink-300 mt-1">
                  ♥ {lp.likes.length}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}