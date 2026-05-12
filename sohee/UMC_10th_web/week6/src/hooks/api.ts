export type LpCard = {
  id: number;
  title: string;
  body: string;
  thumbnail: string;
  uploadDate: string;
  likes: number;
};

export type LpComment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

function formatUploadDate(id: number) {
  const base = new Date(2025, 0, 1);
  const date = new Date(base.getTime() + (id % 30) * 86400000);
  return date.toISOString().slice(0, 10);
}

export async function fetchLpList(sort: 'latest' | 'oldest', pageParam: number = 1) {
  const limit = 6; // Smaller limit for infinite scroll
  const start = (pageParam - 1) * limit;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`);
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

  const sortedItems = items.sort((a, b) =>
    sort === 'latest' ? b.id - a.id : a.id - b.id
  );

  return {
    data: sortedItems,
    nextPage: posts.length === limit ? pageParam + 1 : undefined,
  };
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

export async function fetchLpComments(lpid: number, order: 'oldest' | 'latest', pageParam: number = 1) {
  const limit = 5;
  const start = (pageParam - 1) * limit;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${lpid}/comments?_start=${start}&_limit=${limit}`);
  if (!res.ok) {
    throw new Error('댓글을 불러오는 데 실패했습니다.');
  }

  const comments = await res.json() as Array<{ id: number; postId: number; name: string; email: string; body: string }>;
  const items: LpComment[] = comments.map((comment) => ({
    id: comment.id,
    postId: comment.postId,
    name: comment.name,
    email: comment.email,
    body: comment.body,
  }));

  const sortedItems = items.sort((a, b) =>
    order === 'latest' ? b.id - a.id : a.id - b.id
  );

  return {
    data: sortedItems,
    nextPage: comments.length === limit ? pageParam + 1 : undefined,
  };
}
