import { useCartStore } from '../store/useCartStore';
import CartItem from './CartItem';

export default function CartContainer() {
  const { cartItems, openModal } = useCartStore();

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white text-2xl font-bold">Shopping Cart</h2>
        {cartItems.length > 0 && (
          <button
            onClick={openModal}
            className="text-sm text-gray-400 hover:text-red-400 transition underline underline-offset-2"
          >
            clear cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-5xl mb-4">🎵</p>
          <p className="text-lg">장바구니가 비어있어요.</p>
          <p className="text-sm mt-1">음반을 추가해보세요!</p>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}