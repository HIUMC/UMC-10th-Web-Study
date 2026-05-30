import { useAppSelector } from "../hooks/useCustomRedux";
import CartItem from "./CartItem";

const CartList = () => {
  const { cartItems } = useAppSelector((state) => state.cart);

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-gray-700">
          장바구니가 비어있습니다.
        </h2>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto mt-10 px-4">
      <div>
        {cartItems.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
};

export default CartList;
