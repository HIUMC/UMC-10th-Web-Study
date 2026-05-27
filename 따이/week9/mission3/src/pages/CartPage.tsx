import { useCartStore } from '../store/useCartStore';
import Modal from '../components/Modal';

export default function CartPage() {
  const { cartItems, amount, total, isOpen, increase, decrease, removeItem, openModal } =
    useCartStore();

  return (
    <div className="min-h-screen bg-white">
      {isOpen && <Modal />}

      {/* 헤더 */}
      <header className="bg-slate-800 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ohtani Ahn</h1>
        <div className="flex items-center gap-2 text-lg">
          <span>🛒</span>
          <span className="font-semibold">{amount}</span>
        </div>
      </header>

      {/* 음반 리스트 */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {cartItems.length === 0 ? (
          <p className="text-center text-slate-500 text-lg mt-20">장바구니가 비어있습니다.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-5">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                  <p className="text-sm text-slate-500 truncate">{item.singer}</p>
                  <p className="text-sm font-medium text-slate-700">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrease(item.id)}
                    className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg leading-none"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-medium">{item.amount}</span>
                  <button
                    onClick={() => increase(item.id)}
                    className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg leading-none"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-2 text-slate-400 hover:text-red-500 text-xl leading-none"
                  aria-label="삭제"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 합계 & 전체 삭제 */}
        <div className="mt-8 border-t border-slate-200 pt-6 flex flex-col items-center gap-4">
          <div className="flex justify-between w-full max-w-sm text-slate-700">
            <span>총 수량</span>
            <span className="font-semibold">{amount}개</span>
          </div>
          <div className="flex justify-between w-full max-w-sm text-slate-700">
            <span>총 금액</span>
            <span className="font-semibold">${total.toLocaleString()}</span>
          </div>
          <button
            onClick={openModal}
            className="mt-2 px-8 py-3 border border-slate-700 rounded text-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
          >
            전체 삭제
          </button>
        </div>
      </main>
    </div>
  );
}
