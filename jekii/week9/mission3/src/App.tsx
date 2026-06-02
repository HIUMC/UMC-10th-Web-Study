import "./App.css";
import Navbar from "./components/Navbar";
import CartList from "./components/CartList";
import { PriceBox } from "./components/PriceBox";
import Modal from "./components/Modal";

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 sm:px-6">
        <CartList />
        <PriceBox />
      </main>
      <Modal />
    </div>
  );
}

export default App;
