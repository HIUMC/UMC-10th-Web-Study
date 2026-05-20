import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { ErrorState, LoadingState } from "../components/FetchState";
import { useInView } from "react-intersection-observer";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import CreateLpModal from "../components/CreateLpModal";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: lpList,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isPending,
    isError,
    refetch,
  } = useGetInfiniteLpList(10, "", order);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  const handleOpenCreateModal = () => {
    if (!accessToken) {
      alert("濡쒓렇?몄씠 ?꾩슂???쒕퉬?ㅼ엯?덈떎. 濡쒓렇?명빐二쇱꽭??");
      navigate("/login", {
        state: {
          from: "/",
        },
      });
      return;
    }

    setIsCreateModalOpen(true);
  };

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="relative min-h-full pb-12 w-full max-w-6xl mx-auto px-4 py-6">
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
        {lpList?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        {isFetching && <LpCardSkeletonList count={20} />}
      </div>

      <div
        ref={ref}
        className="h-20 flex items-center justify-center mt-4"
      ></div>

      <button
        type="button"
        onClick={handleOpenCreateModal}
        className="fixed bottom-8 right-8 w-14 h-14 bg-pink-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg hover:bg-pink-500 transition-transform hover:scale-105 z-20"
        aria-label="Open Add LP modal"
      >
        <FiPlus size={28} />
      </button>

      {isCreateModalOpen && (
        <CreateLpModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
};

export default HomePage;
