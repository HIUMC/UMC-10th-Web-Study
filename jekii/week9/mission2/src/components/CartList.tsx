import { useSelector } from "../hooks/useCustomRedux";
import CartItem from "./CartItem.tsx";

const CartList = () => {
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <section className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">Cart</h2>
        <p className="text-sm text-slate-500">{cartItems.length} items</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
          장바구니가 비어 있습니다.
        </div>
      ) : (
        <ul className="space-y-3">
          {cartItems.map((item) => (
            <CartItem key={item.id} lp={item} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default CartList;
