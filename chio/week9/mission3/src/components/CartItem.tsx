import { useCartStore } from "../features/cart/cartStore";
import type { CartItemType } from "../features/cart/cartStore";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const { id, title, singer, price, img, amount } = item;

  return (
    <article className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-4">
        <img
          src={img}
          alt={title}
          className="w-16 h-16 object-cover rounded-lg shadow-sm"
        />
        <div className="flex flex-col text-left">
          <h4 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-1">
            {title}
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
            {singer}
          </p>
          <span className="text-sm font-bold text-slate-800 mt-1">
            ${price}
          </span>
        </div>
      </div>

      <div className="flex items-center bg-slate-200/80 rounded p-0.5">
        <button
          type="button"
          onClick={() => decrease(id)}
          className="w-7 h-7 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-300 rounded-l transition-colors select-none text-sm"
        >
          -
        </button>
        <span className="w-9 h-7 flex items-center justify-center bg-white font-semibold text-slate-800 text-xs border-x border-slate-200/60 select-none">
          {amount}
        </span>
        <button
          type="button"
          onClick={() => increase(id)}
          className="w-7 h-7 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-300 rounded-r transition-colors select-none text-sm"
        >
          +
        </button>
      </div>
    </article>
  );
};

export default CartItem;
