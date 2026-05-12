import { Link, useLocation, useParams } from "react-router-dom";

interface LP {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  likes: unknown[];
  createdAt: string;
}

const fallbackImages = Array.from(
  { length: 50 },
  (_, index) => `https://picsum.photos/seed/doligo-${index}/500/500`
);

const tagGroups = [
  ["#감성", "#새벽", "#LP", "#playlist", "#vinyl"],
  ["#여행", "#기록", "#노을", "#photo", "#daily"],
  ["#재즈", "#카페", "#휴식", "#mood", "#music"],
  ["#락", "#공연", "#밴드", "#live", "#sound"],
  ["#힙합", "#비트", "#groove", "#album", "#track"],
];

const createFallbackLp = (id: string): LP => {
  const numberId = Number(id);
  const index = Math.abs(numberId - 1) % fallbackImages.length;

  return {
    id: numberId,
    title: `LP ${id}`,
    content: "감성적인 LP 상세 페이지입니다.",
    thumbnail: fallbackImages[index],
    likes: Array.from({ length: (index * 7 + 13) % 48 }),
    createdAt: new Date(2026, 4, index + 1).toISOString(),
  };
};

const LpDetailPage = () => {
  const { id = "1" } = useParams();
  const location = useLocation();

  const stateLp = location.state?.lp as LP | undefined;
  const lp = stateLp ?? createFallbackLp(id);

  const tags = tagGroups[Number(id) % tagGroups.length];

  return (
    <section className="min-h-[calc(100dvh-5rem)] bg-black px-8 py-10 text-white">
      <Link to="/" className="mb-6 inline-block text-white/70 hover:text-white">
        ← 목록으로 돌아가기
      </Link>

      <div className="mx-auto max-w-180 rounded-3xl bg-[#1c1c1c] p-10 shadow-xl">
        <div className="mb-6 flex justify-between text-sm text-white/60">
          <span>오타니안</span>
          <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
        </div>

        <h1 className="mb-8 text-3xl font-bold">{lp.title}</h1>

        <div className="mb-8 flex justify-center">
          <div className="relative aspect-square w-80 rounded-full bg-black p-3 shadow-2xl">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="h-full w-full rounded-full object-cover"
            />

            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black bg-white" />
          </div>
        </div>

        <p className="mb-6 text-center leading-7 text-white/75">
          {lp.content}
        </p>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="text-center text-xl">💗 {lp.likes.length}</div>
      </div>
    </section>
  );
};

export default LpDetailPage;