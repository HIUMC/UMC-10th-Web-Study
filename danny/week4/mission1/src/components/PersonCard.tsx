const IMG_BASE = "https://image.tmdb.org/t/p";

interface PersonCardProps {
  profile_path: string | null;
  name: string;
  sub: string;
}

export function PersonCard({ profile_path, name, sub }: PersonCardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-20 text-center">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-800 shrink-0">
        {profile_path ? (
          <img
            src={`${IMG_BASE}/w185${profile_path}`}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xl">
            ?
          </div>
        )}
      </div>
      <p className="text-xs font-medium leading-tight">{name}</p>
      <p className="text-xs text-white/40 leading-tight line-clamp-2">{sub}</p>
    </div>
  );
}
