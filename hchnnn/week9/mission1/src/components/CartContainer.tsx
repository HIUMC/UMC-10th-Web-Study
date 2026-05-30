import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearCart, calculateTotals } from '../store/cartSlice';
import CartItem from './CartItem';

export default function CartContainer() {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(calculateTotals());
    setShowConfirm(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white text-2xl font-bold">Shopping Cart</h2>
        {cartItems.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-sm text-gray-400 hover:text-red-400 transition underline underline-offset-2"
          >
            clear cart
          </button>
        )}
      </div>

      {/* 아이템 목록 */}
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

      {/* 전체 삭제 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a2e1a] border border-[#3a5f3a] rounded-2xl p-8 w-80 text-center flex flex-col gap-5 shadow-2xl">
            <p className="text-white font-bold text-lg">전체 삭제할까요?</p>
            <p className="text-gray-400 text-sm">모든 음반이 장바구니에서 제거됩니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#2a3f2a] text-white hover:bg-[#3a5f3a] transition text-sm"
              >
                취소
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition text-sm"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}