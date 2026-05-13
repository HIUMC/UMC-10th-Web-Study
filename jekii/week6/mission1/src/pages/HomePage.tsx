import { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiPlus } from "react-icons/fi";
import { ErrorState, LoadingState } from "../components/FetchState";
import useGetLpList from "../hooks/useGetLpList";
import type { Lp } from "../types/lp";

const HomePage = () => {
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const { data: lpList, isPending, isError, refetch } = useGetLpList({ order });

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="relative min-h-full pb-12 w-full max-w-6xl mx-auto">
      <div className="flex justify-end mb-8">
        <div className="flex p-1 bg-slate-200/50 dark:bg-[#1e1e24] rounded-lg border border-slate-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setOrder("desc")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              order === "desc"
                ? "bg-white dark:bg-[#2a2b36] shadow-sm text-pink-600 dark:text-pink-400"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-gray-300"
            }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => setOrder("asc")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              order === "asc"
                ? "bg-white dark:bg-[#2a2b36] shadow-sm text-pink-600 dark:text-pink-400"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-gray-300"
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {lpList?.map((lp: Lp) => (
          <Link
            to={`/lp/${lp.id}`}
            key={lp.id}
            className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-[#1e1e24] border border-slate-200 dark:border-gray-800"
          >
            <img
              src={
                lp.thumbnail || "https://via.placeholder.com/400?text=No+Image"
              }
              alt={lp.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <h2 className="font-bold text-white text-lg truncate mb-1">
                {lp.title}
              </h2>
              <div className="flex justify-between items-center text-xs text-gray-300">
                <span>
                  {lp.createdAt
                    ? new Date(lp.createdAt).toLocaleDateString()
                    : "방금 전"}
                </span>
                <div className="flex items-center gap-1.5">
                  <FiHeart className="fill-current" />
                  <span>{lp.likes.length}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {lpList?.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          아직 등록된 LP가 없습니다. 첫 LP를 등록해보세요!
        </div>
      )}

      <Link
        to="/upload"
        className="fixed bottom-8 right-8 w-14 h-14 bg-pink-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg hover:bg-pink-500 transition-transform hover:scale-105 z-20"
      >
        <FiPlus size={28} />
      </Link>
    </div>
  );
};

export default HomePage;
