export default function LpCardSkeleton() {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1",
        borderRadius: 8,
        background: "#222",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}