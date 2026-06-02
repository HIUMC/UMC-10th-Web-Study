import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { clearCart } from "../features/cart/cartSlice";
import { closeModal } from "../features/modal/modalSlice";

const Modal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen } = useSelector((state: RootState) => state.modal);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">전체 삭제</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          장바구니의 모든 상품을 삭제하시겠습니까?
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md bg-[#19273c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#223451] active:bg-[#111b2b]"
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
