type LpRecordProps = {
  thumbnail?: string | null;
  title?: string;
};

const LpRecord = ({ thumbnail, title }: LpRecordProps) => {
  return (
    <div className="mx-auto w-full max-w-[468px] rounded-lg bg-[#25272f] p-6 shadow-2xl md:p-8">
      <div className="relative aspect-square overflow-hidden rounded-full border-[4px] border-black bg-slate-800">
        <img
          src={thumbnail || "https://via.placeholder.com/600?text=No+Image"}
          alt={title || "LP thumbnail"}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[22%] w-[22%] rounded-full border-2 border-slate-400 bg-slate-100 dark:bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

export default LpRecord;
