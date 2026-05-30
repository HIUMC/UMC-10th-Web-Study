import { useEffect } from "react";
import Navbar from "./components/Navbar";
import CartList from "./components/CartList";
import PriceBox from "./components/PriceBox";
import { useAppDispatch, useAppSelector } from "./hooks/useCustomRedux";
import { calculateTotals } from "./slices/cartSlice";

function App() {
  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <CartList />
      <PriceBox />
    </main>
  );
}

export default App;
