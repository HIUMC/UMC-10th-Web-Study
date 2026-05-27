import { useAppSelector } from '../store/hooks';

export default function Footer() {
  const { amount, total } = useAppSelector((state) => state.cart);

  return (
    <footer className="sticky bottom-0 bg-[#1a2e1a] border-t border-[#2a3f2a] px-6 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm">총 수량</span>
          <span className="text-white font-bold">{amount}개</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">총 금액</span>
          <span className="text-[#a8e063] font-bold text-xl">
            ${total.toLocaleString()}
          </span>
        </div>
        <div className="mt-4 w-full h-px bg-[#2a3f2a]" />
        <p className="text-center text-[#3a5f3a] text-xs mt-3">UMC Play List © 2026</p>
      </div>
    </footer>
  );
}