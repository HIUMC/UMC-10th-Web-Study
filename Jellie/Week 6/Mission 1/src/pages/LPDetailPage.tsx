import { Link, useNavigate, useParams } from "react-router-dom";
import { useLPDetail, useLikeLP, useUnlikeLP } from "../hooks/queries/useLP";
import { useMyInfo } from "../hooks/queries/useUser";

export default function LPDetailPage() {
  const { lpId } = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, refetch } = useLPDetail(lpId);
  const { data: myInfo } = useMyInfo();

  const likeMutation = useLikeLP();
  const unlikeMutation = useUnlikeLP();

  const lp = data?.data;
  const myId = myInfo?.data.id;

  const isAuthor = !!lp && !!myId && lp.authorId === myId;
  const isLiked = !!lp && !!myId && lp.likes.some((like) => like.userId === myId);

  const handleToggleLike = () => {
    if (!lp) return;

    if (isLiked) {
      unlikeMutation.mutate(lp.id);
    } else {
      likeMutation.mutate(lp.id);
    }
  };

  const handleTagClick = (tagName: string) => {
    navigate("/lps?search=" + encodeURIComponent(tagName));
  };

  if (isPending) {
    return (
      <section className="max-w-3xl mx-auto">
        <div className="h-[600px] rounded-3xl bg-white/10 animate-pulse" />
      </section>
    );
  }

  if (isError || !lp) {
    return (
      <section className="py-20 text-center">
        <p className="mb-4 text-slate-300">LP 상세 정보를 불러오지 못했습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-lg bg-pink-500"
        >
          다시 시도
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto bg-[#26262d] rounded-3xl p-8 md:p-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {lp.author.avatar ? (
            <img
              src={lp.author.avatar}
              alt={lp.author.name}
              className="w-10 h-10 rounded-full object-cover bg-white/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              👤
            </div>
          )}

          <div>
            <p className="font-bold">{lp.author.name}</p>
            <p className="text-xs text-slate-400">
              올린 사람 · {new Date(lp.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isAuthor && (
          <Link to={"/lp/" + lp.id + "/edit"} className="hover:text-pink-400">
            ✎
          </Link>
        )}
      </div>

      <h1 className="text-2xl font-black mb-8">{lp.title}</h1>

      <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto mb-10">
        <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-black shadow-2xl animate-[spin_1.8s_linear_infinite]">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2f2f2] border-4 border-[#26262d]" />
        <div className="absolute top-1/2 left-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#26262d]" />
      </div>

      <p className="text-slate-200 leading-7 mb-10">{lp.content}</p>

      <footer className="border-t border-white/10 pt-6">
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-3">태그</p>

          <div className="flex flex-wrap gap-2">
            {lp.tags.length > 0 ? (
              lp.tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.name)}
                  className="px-3 py-1 rounded-full bg-slate-600 text-sm hover:bg-pink-500 transition"
                >
                  #{tag.name}
                </button>
              ))
            ) : (
              <span className="text-sm text-slate-500">등록된 태그가 없습니다.</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleToggleLike}
            disabled={likeMutation.isPending || unlikeMutation.isPending}
            className={
              "px-5 py-3 rounded-full border border-white/10 text-xl font-bold transition disabled:opacity-50 " +
              (isLiked
                ? "bg-pink-500 text-white"
                : "bg-white/10 text-slate-300 hover:bg-white/20")
            }
          >
            {isLiked ? "♥" : "♡"} {lp.likes.length}
          </button>
        </div>
      </footer>
    </section>
  );
}