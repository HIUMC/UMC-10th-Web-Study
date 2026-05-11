export default function SkeletonCard() {
  return (
    <div className="card-skeleton">
      <div className="skeleton-image" />
      <div className="skeleton-line short" />
      <div className="skeleton-line long" />
    </div>
  );
}