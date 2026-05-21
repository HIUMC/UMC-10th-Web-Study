const LpCardSkeleton = () => {
  return (
    <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-gray-800 animate-pulse">
      <div className="h-full w-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
    </div>
  );
};

export default LpCardSkeleton;
