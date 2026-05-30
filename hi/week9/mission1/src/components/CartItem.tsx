import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { decrease, increase, removeItem } from '../features/cart/cartSlice';
import type { CartItem as CartItemType } from '../types/cart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch<AppDispatch>();

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
            onClick={() => dispatch(removeItem(item.id))}
            className="mt-2 text-sm text-gray-400 hover:text-red-500"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="flex overflow-hidden rounded bg-slate-300">
        <button
          type="button"
          onClick={() => dispatch(decrease(item.id))}
          className="h-10 w-10 text-xl hover:bg-slate-400"
        >
          -
        </button>

        <div className="flex h-10 w-12 items-center justify-center bg-white text-xl">
          {item.amount}
        </div>

        <button
          type="button"
          onClick={() => dispatch(increase(item.id))}
          className="h-10 w-10 text-xl hover:bg-slate-400"
        >
          +
        </button>
      </div>
    </article>
  );
};

export default CartItem;