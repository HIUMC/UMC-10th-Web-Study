import { Link, useParams } from "react-router-dom";
import { Heart, Pencil, Trash2 } from "lucide-react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { formatRelativeTime } from "../utils/formatDate";

const LpDetailPage = () => {
  const { lpId } = useParams();
  const parsedLpId = Number(lpId);
  const { data, isLoading, isError } = useGetLpDetail(parsedLpId);

  if (!Number.isFinite(parsedLpId)) {
    return (
      <section className="min-h-full bg-black px-6 py-10">
        <p className="text-red-400">잘못된 LP 주소입니다.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="min-h-full bg-black px-6 py-10">
        <p className="text-gray-400">LP 상세 정보를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="min-h-full bg-black px-6 py-10">
        <p className="text-red-400">LP 상세 정보를 불러오지 못했습니다.</p>
      </section>
    );
  }

  const lp = data.data;

  return (
    <section className="min-h-full bg-black px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-5xl rounded-lg bg-[#2a2d34] px-6 py-8 shadow-2xl sm:px-10 lg:px-16">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-base font-bold text-gray-700">
              {lp.author.avatar ? (
                <img
                  src={lp.author.avatar}
                  alt={lp.author.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                lp.author.name.slice(0, 1)
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold">
                {lp.author.name}
              </p>
              <Link
                to="/"
                className="text-sm text-gray-400 transition-colors hover:text-[#ff1493]"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </div>

          <span className="shrink-0 text-sm font-medium text-gray-300">
            {formatRelativeTime(lp.createdAt)}
          </span>
        </div>

        <div className="mt-10 flex items-start justify-between gap-6">
          <h1 className="min-w-0 text-3xl font-extrabold text-white">
            {lp.title}
          </h1>

          <div className="flex shrink-0 items-center gap-4 text-gray-100">
            <button
              type="button"
              aria-label="LP 수정"
              className="transition-colors hover:text-[#ff1493]"
            >
              <Pencil size={24} />
            </button>
            <button
              type="button"
              aria-label="LP 삭제"
              className="transition-colors hover:text-[#ff1493]"
            >
              <Trash2 size={24} />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <div className="aspect-square rounded-md bg-[#252932] p-8 shadow-xl">
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-black bg-black shadow-2xl">
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-300 bg-gray-100 shadow-inner" />
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-3xl whitespace-pre-line text-base leading-8 text-gray-100">
          {lp.content}
        </p>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {lp.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-slate-600 px-4 py-2 text-sm font-bold text-white"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-2xl font-bold">
          <Heart size={36} fill="currentColor" className="text-[#ff5d8f]" />
          <span>{lp.likes.length}</span>
        </div>
      </div>
    </section>
  );
};

export default LpDetailPage;
