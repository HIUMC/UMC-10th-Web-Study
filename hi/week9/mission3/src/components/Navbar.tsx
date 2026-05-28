import { FaShoppingCart } from 'react-icons/fa';
import { useCartStore } from '../store/useCartStore';

const Navbar = () => {
  const amount = useCartStore((state) => state.amount);

  return (
    <nav className="flex h-20 items-center justify-between bg-slate-800 px-8 text-white">
      <h1 className="text-3xl font-bold tracking-wide">LP playlist</h1>

      <div className="flex items-center gap-3 text-2xl font-bold">
        <FaShoppingCart />
        <span>{amount}</span>
      </div>
    </nav>
  );
};

export default Navbar;