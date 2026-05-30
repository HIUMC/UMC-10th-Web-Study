import { FaShoppingCart } from 'react-icons/fa';
import { useCartStore } from '../store/useCartStore';

function Navbar() {
  const amount = useCartStore(
    (state) => state.amount
  );

  return (
    <nav className="bg-slate-800 px-6 py-5 text-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <h1 className="text-3xl font-bold">
          Lister
        </h1>

        <div className="flex items-center gap-2">
          <FaShoppingCart />
          <span>{amount}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;