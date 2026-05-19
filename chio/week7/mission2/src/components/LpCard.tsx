import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Lp } from "../types/lps";

interface LpCardProps {
  lp: Lp;
}

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
    return "just now";
  }

  if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  if (diff < month) {
    const days = Math.floor(diff / day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(diff / year);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

function LpCard({ lp }: LpCardProps) {
  return (
    <Link
      to={`/lp/${lp.id}`}
      className="group relative block aspect-square overflow-hidden bg-zinc-900"
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />

      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/25 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-white">{lp.title}</h2>
          <p className="mt-1 text-sm font-semibold text-white/90">
            {getRelativeTime(lp.createdAt)}
          </p>
        </div>

        <div className="ml-3 flex shrink-0 items-center gap-1 text-sm font-bold text-white">
          <Heart size={18} fill="currentColor" strokeWidth={2.5} />
          <span>{lp.likes.length}</span>
        </div>
      </div>
    </Link>
  );
}

export default LpCard;
