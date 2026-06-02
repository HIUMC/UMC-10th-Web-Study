import { useEffect } from "react";
import { calculateTotals } from "../features/cart/cartSlice";
import { openModal } from "../features/modal/modalSlice";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";

export const PriceBox = () => {
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleInitializeCart = (): void => {
    dispatch(openModal());
  };

  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch]);

  return (
    <section className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <button
        onClick={handleInitializeCart}
        className="rounded-md border border-rose-200 px-4 py-3 font-semibold text-rose-600 transition-colors hover:bg-rose-50"
      >
        전체 삭제
      </button>
      <div className="text-right">
        <p className="text-sm text-slate-500">총 가격</p>
        <p className="text-2xl font-bold text-slate-900">
          {total.toLocaleString()}원
        </p>
      </div>
    </section>
  );
};
