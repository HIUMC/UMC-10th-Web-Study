import { useNavigate } from "react-router-dom";
import type { Lp } from "../../types/lp";

interface LpCardProps {
  lp: Lp;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();
  const likeCount = Array.isArray(lp.likes) ? lp.likes.length : 0;

  return (
    <button
      type="button"
      onClick={() => navigate(`/lp/${lp.id}`)}
      className="group relative aspect-square overflow-hidden rounded-lg bg-gray-800 text-left"
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="line-clamp-2 text-sm font-semibold text-white">
          {lp.title}
        </p>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-200">
          <span>{formatDate(lp.createdAt)}</span>
          <span>♥ {likeCount}</span>
        </div>
      </div>
    </button>
  );
};

export default LpCard;
