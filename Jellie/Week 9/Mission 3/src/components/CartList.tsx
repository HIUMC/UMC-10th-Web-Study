import CartItem from './CartItem';
import { useCartStore } from '../store/useCartStore';

function CartList() {
  const cartItems = useCartStore(
    (state) => state.cartItems
  );

  return (
    <section>
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          lp={item}
        />
      ))}
    </section>
  );
}

export default CartList;