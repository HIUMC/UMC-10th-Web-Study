export const formatTimeAgo = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  const ms = Date.now() - date.getTime();
  if (Number.isNaN(ms)) return iso;
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return "방금 전";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}일 전`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month}달 전`;
  return `${Math.floor(month / 12)}년 전`;
};
