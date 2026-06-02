import "./App.css";
import Navbar from "./components/Navbar";
import CartList from "./components/CartList";
import { Provider } from "react-redux";
import store from "./store/store";
import { PriceBox } from "./components/PriceBox";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 sm:px-6">
          <CartList />
          <PriceBox />
        </main>
      </div>
    </Provider>
  );
}

export default App;
