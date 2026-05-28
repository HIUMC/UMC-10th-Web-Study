import { useCartStore } from '../store/useCartStore';
import type { CartItem as CartItemType } from '../types/cart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <article className="flex items-center justify-between border-b border-gray-200 py-5">
      <div className="flex items-center gap-5">
        <img
          src={item.img}
          alt={item.title}
          className="h-24 w-24 rounded-md object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold text-black">{item.title}</h2>
          <p className="text-lg text-gray-500">{item.singer}</p>
          <p className="text-xl font-bold text-slate-800">
            ${Number(item.price).toLocaleString()}
          </p>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="mt-2 text-sm text-gray-400 hover:text-red-500"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="flex overflow-hidden rounded bg-slate-300">
        <button
          type="button"
          onClick={() =>decrease(item.id)}
          className="h-10 w-10 text-xl hover:bg-slate-400"
        >
          -
        </button>

        <div className="flex h-10 w-12 items-center justify-center bg-white text-xl">
          {item.amount}
        </div>

        <button
          type="button"
          onClick={() => increase(item.id)}
          className="h-10 w-10 text-xl hover:bg-slate-400"
        >
          +
        </button>
      </div>
    </article>
  );
};

export default CartItem;