import { useCartStore } from "../store/useCartStore";
import type { CartItemType } from "../types";

const CartItem = ({ id, img, title, singer, price, amount }: CartItemType) => {
  const { increase, decrease } = useCartStore();

  return (
    <article className="flex items-center justify-between py-6 border-b border-gray-100">
      <div className="flex items-center gap-6">
        <img src={img} alt={title} className="w-20 h-20 object-cover rounded" />
        <div>
          <h4 className="font-bold text-lg text-gray-900">{title}</h4>
          <h5 className="text-sm text-gray-500 mb-2">{singer}</h5>
          <h4 className="font-bold text-gray-900">${price}</h4>
        </div>
      </div>
      <div className="flex items-center border border-gray-200 rounded overflow-hidden shadow-sm">
        <button
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-gray-600 transition-colors"
          onClick={() => decrease(id)}
        >
          -
        </button>
        <div className="px-4 py-1 font-semibold text-center min-w-[2.5rem]">
          {amount}
        </div>
        <button
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-gray-600 transition-colors"
          onClick={() => increase(id)}
        >
          +
        </button>
      </div>
    </article>
  );
};

export default CartItem;
