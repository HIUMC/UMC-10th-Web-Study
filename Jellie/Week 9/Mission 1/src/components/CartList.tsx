import CartItem from './CartItem';
import { useAppSelector } from '../hooks/useRedux';

function CartList() {
  const { cartItems } = useAppSelector((state) => state.cart);

  if (cartItems.length === 0) {
    return (
      <section className="flex min-h-[300px] items-center justify-center">
        <p className="text-xl font-semibold text-gray-500">장바구니가 비어 있습니다.</p>
      </section>
    );
  }

  return (
    <section>
      <ul className="flex flex-col">
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>
    </section>
  );
}

export default CartList;