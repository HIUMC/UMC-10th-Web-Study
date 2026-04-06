export default function LoadingSpinner() {
  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <div
        className='size-12 animate-spin rounded-full border-4 border-[#b2dab1] border-t-transparent'
        role='status'
      >
        <span className='sr-only'>로딩 중...</span>
      </div>
    </div>
  );
}