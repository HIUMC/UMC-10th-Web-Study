import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import type { Lp } from "../types/lp";

type LpCardProps = {
  lp: Lp;
};

const LpCard = ({ lp }: LpCardProps) => {
  return (
    <Link
      to={`/lp/${lp.id}`}
      className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-[#1e1e24] border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <img
        src={lp.thumbnail}
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
            <FiHeart className="fill-current text-pink-500" />
            <span>{lp.likes?.length || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LpCard;
