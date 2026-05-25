import { useCartStore } from "../store/useCartStore";

const PriceBox = () => {
  const { cartItems, total, openModal } = useCartStore();

  if (cartItems.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-16 px-4 flex flex-col items-center">
      <div className="w-full flex justify-between items-center border-t border-gray-300 pt-6 mb-8 text-xl font-bold text-gray-900">
        <span>총 금액</span>
        <span>${total.toLocaleString()}</span>
      </div>
      <button
        className="px-8 py-3 bg-white border border-gray-800 text-gray-800 font-medium rounded hover:bg-gray-50 transition-colors"
        onClick={() => openModal()}
      >
        전체 삭제
      </button>
    </div>
  );
};

export default PriceBox;
