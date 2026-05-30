import { useAppDispatch } from '../store/hooks';
import { increase, decrease, removeItem, calculateTotals } from '../features/carts/cartSlice';
import type { CartItem as CartItemType } from '../constants/cartItems';

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const dispatch = useAppDispatch();

  const handleIncrease = () => {
    dispatch(increase(item.id));
    dispatch(calculateTotals());
  };

  const handleDecrease = () => {
    dispatch(decrease(item.id));
    dispatch(calculateTotals());
  };

  const handleRemove = () => {
    dispatch(removeItem(item.id));
    dispatch(calculateTotals());
  };

  return (
    <div className="flex items-center gap-5 py-5 border-b border-[#2a3f2a] last:border-0">
      {/* 앨범 커버 */}
      <img
        src={item.img}
        alt={item.title}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 shadow-md"
      />

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm leading-snug truncate pr-4">{item.title}</p>
        <p className="text-gray-400 text-xs mt-0.5 truncate">{item.singer}</p>
        <p className="text-[#a8e063] text-sm font-bold mt-1">
          ${Number(item.price).toLocaleString()}
        </p>
      </div>

      {/* 수량 조절 */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 rounded-lg bg-[#2a3f2a] text-[#a8e063] font-bold hover:bg-[#3a5f3a] transition text-lg flex items-center justify-center border border-[#3a5f3a]"
        >
          −
        </button>
        <span className="text-white font-bold text-base w-5 text-center">{item.amount}</span>
        <button
          onClick={handleIncrease}
          className="w-8 h-8 rounded-lg bg-[#2a3f2a] text-[#a8e063] font-bold hover:bg-[#3a5f3a] transition text-lg flex items-center justify-center border border-[#3a5f3a]"
        >
          +
        </button>
      </div>

      {/* 삭제 */}
      <button
        onClick={handleRemove}
        className="text-gray-600 hover:text-red-400 transition text-sm ml-2 flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}