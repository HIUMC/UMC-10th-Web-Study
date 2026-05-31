import type { CartItem } from '../types/cart';
import { useCartStore } from '../store/useCartStore';

type Props = {
  lp: CartItem;
};

function CartItem({ lp }: Props) {
  const increase = useCartStore(
    (state) => state.increase
  );

  const decrease = useCartStore(
    (state) => state.decrease
  );

  return (
    <li className="flex items-center border-b py-5">
      <img
        src={lp.img}
        alt={lp.title}
        className="mr-5 h-20 w-20 object-cover"
      />

      <div className="flex-1">
        <h3>{lp.title}</h3>
        <p>{lp.singer}</p>
        <p>{lp.price}원</p>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => decrease(lp.id)}
        >
          -
        </button>

        <span>{lp.amount}</span>

        <button
          onClick={() => increase(lp.id)}
        >
          +
        </button>
      </div>
    </li>
  );
}

export default CartItem;