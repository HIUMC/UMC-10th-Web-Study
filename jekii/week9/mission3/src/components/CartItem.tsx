import type { Lp } from "../types/cart";
import { useCartStore } from "../hooks/useCartStore";

interface CartItemProps {
  lp: Lp;
}

const CartItem = ({ lp }: CartItemProps) => {
  const {
    actions: { decrease, increase, removeItem },
  } = useCartStore();

  const handleIncreaseCount = (): void => {
    increase(lp.id);
  };

  const handleDecreaseCount = (): void => {
    if (lp.amount === 1) {
      removeItem(lp.id);
      return;
    }

    decrease(lp.id);
  };

  return (
    <li className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <img
        src={lp.img}
        alt={`${lp.title} LP cover`}
        className="h-24 w-24 rounded-md object-cover"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-semibold text-slate-900">
          {lp.title}
        </h3>
        <p className="mt-1 truncate text-sm text-slate-500">{lp.singer}</p>
        <p className="mt-3 text-sm font-bold text-slate-800">
          {lp.price.toLocaleString()}원
        </p>
      </div>

      <div className="flex items-center self-start rounded-md border border-slate-200 sm:self-center">
        <button
          onClick={handleDecreaseCount}
          className="grid h-10 w-10 place-items-center rounded-l-md text-lg font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          -
        </button>
        <span className="grid h-10 min-w-12 place-items-center border-x border-slate-200 px-3 text-sm font-semibold">
          {lp.amount}
        </span>
        <button
          onClick={handleIncreaseCount}
          className="grid h-10 w-10 place-items-center rounded-r-md text-lg font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          +
        </button>
      </div>
    </li>
  );
};

export default CartItem;
