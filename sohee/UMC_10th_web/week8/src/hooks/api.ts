export type LpCard = {
  id: number;
  title: string;
  body: string;
  thumbnail: string;
  uploadDate: string;
  likes: number;
  tags: string[];
  author: string;
  likedByMe?: boolean;
};

export type LpComment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
  mine?: boolean;
};

export type CreateLpPayload = {
  title: string;
  body: string;
  tags: string[];
  imageFile?: File | null;
  author: string;
};

export type UpdateLpPayload = {
  id: number;
  title: string;
  body: string;
  tags: string[];
};

const LOCAL_LPS_KEY = 'week7-local-lps';
const LOCAL_COMMENTS_KEY = 'week7-local-comments';

const DEMO_LPS: LpCard[] = [
  {
    id: 10001,
    title: '타입스크립트로 만든 첫 LP',
    body: 'Debounce와 TanStack Query를 함께 연습하기 좋은 타입스크립트 검색 예시입니다.',
    thumbnail: 'https://picsum.photos/seed/typescript-lp-1/520/320',
    uploadDate: '2025-04-17',
    likes: 42,
    tags: ['typescript', '타입스크립트', 'react'],
    author: 'demo',
    likedByMe: false,
  },
  {
    id: 10002,
    title: 'TypeScript 검색 미션',
    body: '사용자가 타입스크립트를 입력하는 동안에는 요청을 보내지 않고, 입력이 멈춘 뒤 검색합니다.',
    thumbnail: 'https://picsum.photos/seed/typescript-lp-2/520/320',
    uploadDate: '2025-04-18',
    likes: 36,
    tags: ['typescript', 'debounce', 'query'],
    author: 'demo',
    likedByMe: false,
  },
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function formatUploadDate(id: number) {
  const base = new Date(2025, 0, 1);
  const date = new Date(base.getTime() + (id % 30) * 86400000);
  return date.toISOString().slice(0, 10);
}

function localLps() {
  return readStorage<LpCard[]>(LOCAL_LPS_KEY, []);
}

function demoLps() {
  return DEMO_LPS;
}

function saveLocalLps(items: LpCard[]) {
  writeStorage(LOCAL_LPS_KEY, items);
}

function localComments() {
  return readStorage<Record<string, LpComment[]>>(LOCAL_COMMENTS_KEY, {});
}

function saveLocalComments(items: Record<string, LpComment[]>) {
  writeStorage(LOCAL_COMMENTS_KEY, items);
}

export async function fetchLpList(sort: 'latest' | 'oldest', pageParam: number = 1) {
  const limit = 6;
  const start = (pageParam - 1) * limit;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`);

  if (!res.ok) {
    throw new Error('LP 목록을 불러오지 못했습니다.');
  }

  const posts = (await res.json()) as Array<{ id: number; title: string; body: string }>;
  const remoteItems: LpCard[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    thumbnail: `https://picsum.photos/seed/lp-${post.id}/520/320`,
    uploadDate: formatUploadDate(post.id),
    likes: 20 + (post.id % 30),
    tags: ['vinyl', 'daily'],
    author: 'jsonplaceholder',
  }));

  const items = pageParam === 1 ? [...localLps(), ...remoteItems] : remoteItems;
  const sortedItems = items.sort((a, b) => (sort === 'latest' ? b.id - a.id : a.id - b.id));

  return {
    data: sortedItems,
    nextPage: posts.length === limit ? pageParam + 1 : undefined,
  };
}

export async function searchLpList(sort: 'latest' | 'oldest', query: string, cursor: number = 0) {
  const limit = 6;
  const trimmedQuery = query.trim();
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?q=${encodeURIComponent(trimmedQuery)}&_start=${cursor}&_limit=${limit}`
  );

  if (!res.ok) {
    throw new Error('LP 검색 결과를 불러오지 못했습니다.');
  }

  const posts = (await res.json()) as Array<{ id: number; title: string; body: string }>;
  const localMatches =
    cursor === 0
      ? [...demoLps(), ...localLps()].filter((item) => {
          const lowerQuery = trimmedQuery.toLowerCase();
          return (
            item.title.toLowerCase().includes(lowerQuery) ||
            item.body.toLowerCase().includes(lowerQuery) ||
            item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
          );
        })
      : [];
  const remoteItems: LpCard[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    thumbnail: `https://picsum.photos/seed/lp-${post.id}/520/320`,
    uploadDate: formatUploadDate(post.id),
    likes: 20 + (post.id % 30),
    tags: ['vinyl', 'daily'],
    author: 'jsonplaceholder',
  }));

  const sortedItems = [...localMatches, ...remoteItems].sort((a, b) =>
    sort === 'latest' ? b.id - a.id : a.id - b.id
  );

  return {
    data: sortedItems,
    nextCursor: posts.length === limit ? cursor + limit : undefined,
  };
}

export async function fetchLpDetail(lpid: number) {
  const demoItem = demoLps().find((item) => item.id === lpid);
  if (demoItem) return demoItem;

  const localItem = localLps().find((item) => item.id === lpid);
  if (localItem) return localItem;

  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${lpid}`);
  if (!res.ok) {
    throw new Error('LP 상세 정보를 불러오지 못했습니다.');
  }

  const post = (await res.json()) as { id: number; title: string; body: string };
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    thumbnail: `https://picsum.photos/seed/lp-detail-${post.id}/940/520`,
    uploadDate: formatUploadDate(post.id),
    likes: 18 + (post.id % 21),
    tags: ['vinyl', 'detail'],
    author: 'jsonplaceholder',
    likedByMe: false,
  };
}

export async function createLpPost(payload: CreateLpPayload) {
  const body = {
    title: payload.title,
    body: payload.body,
    userId: 1,
    tags: payload.tags,
  };
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('LP를 등록하지 못했습니다.');
  }

  const created = (await res.json()) as { id?: number };
  const nextId = Math.max(created.id ?? 101, Date.now());
  const thumbnail = payload.imageFile
    ? URL.createObjectURL(payload.imageFile)
    : `https://picsum.photos/seed/local-lp-${nextId}/520/320`;
  const lp: LpCard = {
    id: nextId,
    title: payload.title,
    body: payload.body,
    thumbnail,
    uploadDate: new Date().toISOString().slice(0, 10),
    likes: 0,
    tags: payload.tags,
    author: payload.author,
    likedByMe: false,
  };

  saveLocalLps([lp, ...localLps()]);
  return lp;
}

export async function updateLpPost(payload: UpdateLpPayload) {
  const remoteId = payload.id <= 100 ? payload.id : 1;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${remoteId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: payload.title,
      body: payload.body,
      tags: payload.tags,
    }),
  });

  if (!res.ok) {
    throw new Error('LP를 수정하지 못했습니다.');
  }

  const items = localLps();
  saveLocalLps(
    items.map((item) =>
      item.id === payload.id ? { ...item, title: payload.title, body: payload.body, tags: payload.tags } : item
    )
  );
}

export async function deleteLpPost(id: number) {
  const remoteId = id <= 100 ? id : 1;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${remoteId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('LP를 삭제하지 못했습니다.');
  }

  saveLocalLps(localLps().filter((item) => item.id !== id));
}

export async function toggleLpLike(id: number) {
  const current = await fetchLpDetail(id);
  const next = {
    ...current,
    likedByMe: !current.likedByMe,
    likes: current.likedByMe ? Math.max(0, current.likes - 1) : current.likes + 1,
  };
  const items = localLps();
  const exists = items.some((item) => item.id === id);
  saveLocalLps(exists ? items.map((item) => (item.id === id ? next : item)) : [next, ...items]);
  return next;
}

export async function fetchLpComments(lpid: number, order: 'oldest' | 'latest', pageParam: number = 1) {
  const limit = 5;
  const start = (pageParam - 1) * limit;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${lpid}/comments?_start=${start}&_limit=${limit}`);

  if (!res.ok) {
    throw new Error('댓글을 불러오지 못했습니다.');
  }

  const comments = (await res.json()) as Array<{
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
  }>;
  const localItems = localComments()[String(lpid)] ?? [];
  const remoteItems: LpComment[] = comments.map((comment) => ({
    id: comment.id,
    postId: comment.postId,
    name: comment.name,
    email: comment.email,
    body: comment.body,
    mine: false,
  }));

  const items = pageParam === 1 ? [...localItems, ...remoteItems] : remoteItems;
  const sortedItems = items.sort((a, b) => (order === 'latest' ? b.id - a.id : a.id - b.id));

  return {
    data: sortedItems,
    nextPage: comments.length === limit ? pageParam + 1 : undefined,
  };
}

export async function createComment(lpid: number, body: string, nickname: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${lpid}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nickname, email: `${nickname}@lp.local`, body }),
  });

  if (!res.ok) {
    throw new Error('댓글을 작성하지 못했습니다.');
  }

  const created = (await res.json()) as { id?: number };
  const stores = localComments();
  const comment: LpComment = {
    id: Math.max(created.id ?? 501, Date.now()),
    postId: lpid,
    name: nickname,
    email: `${nickname}@lp.local`,
    body,
    mine: true,
  };
  stores[String(lpid)] = [comment, ...(stores[String(lpid)] ?? [])];
  saveLocalComments(stores);
  return comment;
}

export async function updateComment(lpid: number, commentId: number, body: string) {
  const remoteId = commentId <= 500 ? commentId : 1;
  const res = await fetch(`https://jsonplaceholder.typicode.com/comments/${remoteId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    throw new Error('댓글을 수정하지 못했습니다.');
  }

  const stores = localComments();
  stores[String(lpid)] = (stores[String(lpid)] ?? []).map((comment) =>
    comment.id === commentId ? { ...comment, body } : comment
  );
  saveLocalComments(stores);
}

export async function deleteComment(lpid: number, commentId: number) {
  const remoteId = commentId <= 500 ? commentId : 1;
  const res = await fetch(`https://jsonplaceholder.typicode.com/comments/${remoteId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('댓글을 삭제하지 못했습니다.');
  }

  const stores = localComments();
  stores[String(lpid)] = (stores[String(lpid)] ?? []).filter((comment) => comment.id !== commentId);
  saveLocalComments(stores);
}
