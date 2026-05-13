export type LpCard = {
  id: number;
  title: string;
  body: string;
  thumbnail: string;
  uploadDate: string;
  likes: number;
};

function formatUploadDate(id: number) {
  const base = new Date(2025, 0, 1);
  const date = new Date(base.getTime() + (id % 30) * 86400000);
  return date.toISOString().slice(0, 10);
}

export async function fetchLpList(sort: 'latest' | 'oldest') {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12');
  if (!res.ok) {
    throw new Error('LP 목록을 불러오는 데 실패했습니다.');
  }

  const posts = await res.json() as Array<{ id: number; title: string; body: string }>;
  const items: LpCard[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    thumbnail: `https://picsum.photos/seed/lp-${post.id}/520/320`,
    uploadDate: formatUploadDate(post.id),
    likes: 20 + (post.id % 30),
  }));

  return items.sort((a, b) =>
    sort === 'latest' ? b.id - a.id : a.id - b.id
  );
}

export async function fetchLpDetail(lpid: number) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${lpid}`);
  if (!res.ok) {
    throw new Error('LP 상세를 불러오는 데 실패했습니다.');
  }

  const post = await res.json() as { id: number; title: string; body: string };
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    thumbnail: `https://picsum.photos/seed/lp-detail-${post.id}/940/520`,
    uploadDate: formatUploadDate(post.id),
    likes: 18 + (post.id % 21),
  };
}