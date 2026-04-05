import { useEffect, useState } from "react";
import Header from "./components/Header";
import Main from "./pages/Main";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

type CartItem = {
  id: number;
  name: string;
  price: number;
};

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const handle = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handle);
    return () => window.removeEventListener("popstate", handle);
  }, []);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  let Page;

  if (path === "/") {
    Page = <Main />;
  } else if (path.startsWith("/product/")) {
    const id = path.split("/")[2];
    Page = <ProductDetail id={id} addToCart={addToCart} />;
  } else if (path === "/cart") {
    Page = <Cart cart={cart} />;
  } else {
    Page = <div>404</div>;
  }

  return (
    <div>
      <Header />
      {Page}
    </div>
  );
}