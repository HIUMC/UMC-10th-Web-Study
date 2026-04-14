export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

export const movieCategories = [
  { key: 'popular', label: '인기 영화', description: '지금 가장 많이 사랑받는 작품' },
  { key: 'now_playing', label: '상영 중', description: '극장에서 만날 수 있는 최신작' },
  { key: 'top_rated', label: '평점 높은', description: '관객과 평단이 함께 인정한 명작' },
  { key: 'upcoming', label: '개봉 예정', description: '곧 찾아오는 기대작 미리 보기' },
] as const;

export const getCategoryMeta = (category?: string) => {
  return (
    movieCategories.find((item) => item.key === category) ?? movieCategories[0]
  );
};

export const getMovieListUrl = (category: string, page: number) => {
  const searchParams = new URLSearchParams({
    language: 'ko-KR',
    page: String(page),
  });

  return `${TMDB_API_BASE_URL}/movie/${category}?${searchParams.toString()}`;
};

export const getMovieDetailUrl = (movieId: string) => {
  const searchParams = new URLSearchParams({
    language: 'ko-KR',
  });

  return `${TMDB_API_BASE_URL}/movie/${movieId}?${searchParams.toString()}`;
};

export const getPosterUrl = (path: string | null, size = 'w500') => {
  if (!path) {
    return 'https://placehold.co/500x750/0f172a/f8fafc?text=No+Image';
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const formatRuntime = (runtime?: number) => {
  if (!runtime) {
    return '상영 시간 정보 없음';
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (!hours) {
    return `${minutes}분`;
  }

  return `${hours}시간 ${minutes}분`;
};

export const formatCurrency = (value?: number) => {
  if (!value) {
    return '정보 없음';
  }

  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatVoteAverage = (voteAverage: number) => {
  return `${voteAverage.toFixed(1)} / 10`;
};
