import { Link } from "react-router-dom";
import type { LP } from "../../types/lp";

interface LpCardProps {
  lp: LP;
}

export default function LpCard({ lp }: LpCardProps) {
  return (
    <Link
      to={`/lp/${lp.id}`}
      className="group relative block overflow-hidden rounded-xl bg-zinc-900 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
    >
      <div className="aspect-square w-full overflow-hidden bg-black">
        {lp.thumbnail ? (
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-1/2 w-1/2 rounded-full border-4 border-zinc-800 bg-zinc-900" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h3 className="truncate text-base font-bold text-white group-hover:text-pink-400">
          {lp.title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            작성자 ID: {lp.authorId}
          </span>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{lp.likeCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
