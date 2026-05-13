import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className='flex min-h-[70vh] flex-col items-center justify-center text-center'>
      <h1 className='text-5xl font-bold text-lime-300'>영화 정보 사이트</h1>
      <p className='mt-4 text-lg text-gray-300'>
        인기 영화, 개봉 예정, 평점 높은 영화, 상영 중인 영화를 둘러보세요.
      </p>

      <div className='mt-8 flex flex-wrap justify-center gap-4'>
        <Link
          to='/popular'
          className='rounded-full bg-lime-300 px-6 py-3 font-semibold text-black transition hover:opacity-90'
        >
          인기 영화 보기
        </Link>
        <Link
          to='/upcoming'
          className='rounded-full bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20'
        >
          개봉 예정 보기
        </Link>
      </div>
    </section>
  );
}