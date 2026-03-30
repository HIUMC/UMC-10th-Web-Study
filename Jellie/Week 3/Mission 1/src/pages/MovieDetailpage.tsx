import { useParams } from 'react-router-dom';

export default function MovieDetailPage() {
  const { movieId } = useParams();

  return (
    <section className='flex min-h-[60vh] items-center justify-center'>
      <div className='rounded-2xl bg-white/5 px-8 py-10 text-center'>
        <h1 className='text-3xl font-bold text-lime-300'>Movie Detail Page</h1>
        <p className='mt-4 text-gray-300'>선택한 영화 ID: {movieId}</p>
      </div>
    </section>
  );
}