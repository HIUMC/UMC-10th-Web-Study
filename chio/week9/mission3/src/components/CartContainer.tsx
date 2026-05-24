import CartItem from "./CartItem";
import { useCartStore } from "../features/cart/cartStore";
import { useModalStore } from "../features/modal/modalStore";

const CartContainer = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const total = useCartStore((state) => state.total);
  const amount = useCartStore((state) => state.amount);
  const openModal = useModalStore((state) => state.openModal);

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-4 flex flex-col flex-1">
      <div className="flex flex-col flex-1">
        {amount < 1 ? (
          <div className="text-center flex items-center justify-center flex-1 py-20">
            <p className="text-slate-400 text-sm font-medium">
              장바구니가 비어 있습니다.
            </p>
          </div>
        ) : (
          cartItems.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>

      <footer className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-slate-700 text-[15px]">총 가격</span>
          <span className="font-extrabold text-slate-900 text-base">
            ${total}
          </span>
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={openModal}
            className="border border-slate-700 text-slate-800 font-medium px-5 py-2 rounded-md hover:bg-slate-50 transition active:bg-slate-100 text-xs tracking-wide shadow-sm"
          >
            전체 삭제
          </button>
        </div>
      </footer>
    </section>
  );
};

export default CartContainer;
