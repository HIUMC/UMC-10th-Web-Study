import { FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "../hooks/useCartStore";

const Navbar = () => {
  const { amount } = useCartStore();

  return (
    <div className="flex justify-between items-center p-5 px-15 bg-gray-800 text-white">
      <h1
        className="text-3xl font-bold pl-10"
        onClick={() => (window.location.href = "/")}
      >
        SHOP
      </h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};

export default Navbar;
