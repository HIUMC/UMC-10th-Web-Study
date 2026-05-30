import { useCartStore } from "../store/useCartStore";

const Modal = () => {
  const { isOpen, closeModal, clearCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl text-center w-[22rem]">
        <h4 className="text-[1.1rem] font-bold text-gray-900 mb-6">
          정말 삭제하시겠습니까?
        </h4>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-200 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors"
            onClick={() => closeModal()}
          >
            아니요
          </button>
          <button
            type="button"
            className="px-6 py-2 border border-red-500 rounded bg-red-500 text-white hover:bg-red-600 font-medium transition-colors"
            onClick={() => {
              clearCart();
              closeModal();
            }}
          >
            네
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Modal;
