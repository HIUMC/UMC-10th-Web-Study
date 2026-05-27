import { useCartStore } from '../store/useCartStore';

export default function Modal() {
  const { closeModal, clearCart, calculateTotals } = useCartStore();

  const handleConfirm = () => {
    clearCart();
    calculateTotals();
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a2e1a] border border-[#3a5f3a] rounded-2xl p-8 w-80 text-center flex flex-col gap-5 shadow-2xl">
        <p className="text-white font-bold text-lg">전체 삭제할까요?</p>
        <p className="text-gray-400 text-sm">모든 음반이 장바구니에서 제거됩니다.</p>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 rounded-xl bg-[#2a3f2a] text-white hover:bg-[#3a5f3a] transition text-sm"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition text-sm"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}