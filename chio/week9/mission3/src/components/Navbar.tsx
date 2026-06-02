import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../features/cart/cartStore";

const Navbar = () => {
  const amount = useCartStore((state) => state.amount);

  return (
    <nav className="bg-[#19273c] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold tracking-wide">Chio</div>
      <div className="flex items-center gap-2 select-none">
        <ShoppingCart className="w-6 h-6" />
        <span className="text-lg font-bold">{amount}</span>
      </div>
    </nav>
  );
};

export default Navbar;
