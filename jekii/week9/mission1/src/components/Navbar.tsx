import { FaShoppingCart } from "react-icons/fa";
import { calculateTotals, type CartState } from "../slices/cartSlice";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { useEffect } from "react";

const Navbar = () => {
  const { amount, cartItems } = useSelector((state): CartState => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);
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
