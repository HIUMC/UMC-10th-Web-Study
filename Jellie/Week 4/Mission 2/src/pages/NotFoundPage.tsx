import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className='flex min-h-[60vh] flex-col items-center justify-center text-center'>
      <h1 className='text-5xl font-bold text-red-400'>404</h1>
      <p className='mt-4 text-lg text-gray-300'>페이지를 찾을 수 없습니다.</p>
      <Link
        to='/'
        className='mt-6 rounded-full bg-lime-300 px-6 py-3 font-semibold text-black'
      >
        홈으로 이동
      </Link>
    </section>
  );
}