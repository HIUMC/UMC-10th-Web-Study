import { decrease, increase, removeItem } from '../features/cart/cartSlice';
import type { CartItem as CartItemType } from '../types/cart';
import { useAppDispatch } from '../hooks/useRedux';

type CartItemProps = {
  lp: CartItemType;
};

function CartItem({ lp }: CartItemProps) {
  const dispatch = useAppDispatch();

  const handleIncrease = () => {
    dispatch(increase({ id: lp.id }));
  };

  const handleDecrease = () => {
    if (lp.amount === 1) {
      dispatch(removeItem({ id: lp.id }));
      return;
    }

    dispatch(decrease({ id: lp.id }));
  };

  return (
    <li className="flex items-center border-b border-gray-200 py-5">
      <img className="mr-5 h-20 w-20 rounded-md object-cover" src={lp.img} alt={lp.title} />

      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900">{lp.title}</h3>
        <p className="text-sm font-medium text-gray-500">{lp.singer}</p>
        <p className="mt-1 text-sm font-bold text-gray-700">${lp.price}</p>
      </div>

      <div className="flex items-center">
        <button
          className="cursor-pointer rounded-l-md bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
          onClick={handleDecrease}
        >
          -
        </button>

        <span className="border-y border-gray-300 px-5 py-2 font-semibold">{lp.amount}</span>

        <button
          className="cursor-pointer rounded-r-md bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
          onClick={handleIncrease}
        >
          +
        </button>
      </div>
    </li>
  );
}

export default CartItem;