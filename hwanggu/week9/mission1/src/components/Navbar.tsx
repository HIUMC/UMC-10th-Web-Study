import { useAppSelector } from '../store/hooks';

export default function Navbar() {
  const amount = useAppSelector((state) => state.cart.amount);

  return (
    <nav className="bg-[#1a2e1a] text-white px-8 py-4 flex items-center justify-between shadow-lg sticky top-0 z-10">
      <h1 className="text-xl font-bold tracking-wide text-[#a8e063]"> UMC Play List</h1>
      <div className="relative flex items-center gap-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a8e063]">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <span className="text-white font-bold text-lg">{amount}</span>
      </div>
    </nav>
  );
}
