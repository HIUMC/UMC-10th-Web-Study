import { useCartStore } from '../store/useCartStore';

export default function Modal() {
  const { clearCart, closeModal } = useCartStore();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-6 shadow-xl">
        <p className="text-xl font-semibold text-slate-800">정말 삭제하시겠습니까?</p>
        <div className="flex gap-4">
          <button
            onClick={closeModal}
            className="px-6 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          >
            아니요
          </button>
          <button
            onClick={() => {
              clearCart();
              closeModal();
            }}
            className="px-6 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-medium"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
