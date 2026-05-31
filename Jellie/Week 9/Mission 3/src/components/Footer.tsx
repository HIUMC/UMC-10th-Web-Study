import { useCartStore } from '../store/useCartStore';

function Footer() {
  const total = useCartStore(
    (state) => state.total
  );

  const openModal = useCartStore(
    (state) => state.openModal
  );

  return (
    <footer className="mt-8 flex items-center justify-between">
      <div>
        총 가격 : {total.toLocaleString()}원
      </div>

      <button onClick={openModal}>
        전체 삭제
      </button>
    </footer>
  );
}

export default Footer;