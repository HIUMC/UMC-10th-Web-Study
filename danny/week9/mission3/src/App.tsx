import { useEffect } from "react";
import Navbar from "./components/Navbar";
import CartList from "./components/CartList";
import PriceBox from "./components/PriceBox";
import Modal from "./components/Modal";
import { useCartStore } from "./store/useCartStore";

function App() {
  const { cartItems, calculateTotals } = useCartStore();
  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return (
    <main className="min-h-screen bg-white relative">
      <Navbar />
      <CartList />
      <PriceBox />
      <Modal />
    </main>
  );
}

export default App;
