import { openModal } from '../features/modal/modalSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';

function Footer() {
  const dispatch = useAppDispatch();
  const total = useAppSelector((state) => state.cart.total);

  return (
    <footer className="mt-8 flex items-center justify-between">
      <div className="text-xl font-bold">총 가격: {total.toLocaleString()}원</div>

      <button
        className="cursor-pointer rounded-md border border-gray-500 px-6 py-4 font-semibold hover:bg-gray-100"
        onClick={() => dispatch(openModal())}
      >
        전체 삭제
      </button>
    </footer>
  );
}

export default Footer;