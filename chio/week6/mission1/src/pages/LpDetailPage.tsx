import { Heart, Pencil, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";

const getRelativeTime = (value: Date | string) => {
  const createdAt = new Date(value);
  const diff = Date.now() - createdAt.getTime();

  if (Number.isNaN(diff)) {
    return "";
  }

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (diff < minute) {
    return "방금 전";
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)}분 전`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}시간 전`;
  }

  if (diff < month) {
    return `${Math.floor(diff / day)}일 전`;
  }

  if (diff < year) {
    return `${Math.floor(diff / month)}개월 전`;
  }

  return `${Math.floor(diff / year)}년 전`;
};

function LpDetailPage() {
  const { lpid } = useParams();
  const lpId = Number(lpid);
  const isValidLpId = Number.isInteger(lpId) && lpId > 0;
  const { data, isPending, isError } = useGetLpDetail(lpId);
  const lp = data?.data;

  if (!isValidLpId) {
    return (
      <section className="flex min-h-full items-center justify-center bg-black px-6 py-10 text-white">
        <p className="text-sm font-semibold text-zinc-400">
          올바르지 않은 LP 주소입니다.
        </p>
      </section>
    );
  }

  if (isPending) {
    return (
      <section className="flex min-h-full items-center justify-center bg-black px-6 py-10 text-white">
        <p className="text-sm font-semibold text-zinc-400">
          LP 상세 정보를 불러오는 중입니다.
        </p>
      </section>
    );
  }

  if (isError || !lp) {
    return (
      <section className="flex min-h-full items-center justify-center bg-black px-6 py-10 text-white">
        <p className="text-sm font-semibold text-red-400">
          LP 상세 정보를 불러오지 못했습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-full bg-black px-5 py-9 text-white md:px-12 lg:px-20">
      <article className="mx-auto flex w-full max-w-5xl flex-col rounded-2xl bg-[#282b33] px-6 py-8 shadow-xl shadow-black/35 sm:px-10 md:px-16">
        <header className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {lp.author.avatar ? (
              <img
                src={lp.author.avatar}
                alt={lp.author.name}
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-lg font-black text-emerald-700">
                {lp.author.name.slice(0, 1)}
              </div>
            )}
            <p className="truncate text-2xl font-bold">{lp.author.name}</p>
          </div>

          <time className="shrink-0 pt-1 text-base font-medium text-white/90">
            {getRelativeTime(lp.createdAt)}
          </time>
        </header>

        <div className="mt-12 flex items-start justify-between gap-4">
          <h1 className="min-w-0 flex-1 break-words text-3xl font-bold">
            {lp.title}
          </h1>

          <div className="flex shrink-0 items-center gap-4 pt-1 text-white">
            <button type="button" aria-label="LP 수정" className="p-1">
              <Pencil size={24} strokeWidth={2.3} />
            </button>
            <button type="button" aria-label="LP 삭제" className="p-1">
              <Trash2 size={24} strokeWidth={2.3} />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-14 w-full max-w-xl rounded-lg bg-[#262a32] p-5 shadow-2xl shadow-black/40">
          <div className="relative aspect-square overflow-hidden rounded-full border-4 border-black">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-1/2 top-1/2 h-[19%] w-[19%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-500 bg-slate-100" />
          </div>
        </div>

        <p className="mx-auto mt-10 w-full max-w-2xl whitespace-pre-line break-words text-lg font-medium leading-relaxed text-white/95">
          {lp.content}
        </p>

        {lp.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {lp.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-slate-600/70 px-4 py-2 text-base font-bold text-white"
              >
                # {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-3 text-3xl font-semibold">
          <Heart size={42} fill="#fb5d8a" strokeWidth={0} />
          <span>{lp.likes.length}</span>
        </div>
      </article>
    </section>
  );
}

export default LpDetailPage;
