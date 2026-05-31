import { FaShoppingCart } from 'react-icons/fa';
import { useAppSelector } from '../hooks/useRedux';

function Navbar() {
  const { amount } = useAppSelector((state) => state.cart);

  return (
    <nav className="bg-slate-800 px-6 py-5 text-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <h1
          className="cursor-pointer text-3xl font-bold"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          Lister
        </h1>

        <div className="flex items-center gap-2">
          <FaShoppingCart className="text-2xl" />
          <span className="text-xl font-semibold">{amount}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;