import { create } from "zustand";
import cartItems from "../constants/cartItems";

interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

interface CartStore {
  cartItems: CartItem[];
  amount: number;
  total: number;

  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cartItems,
  amount: 0,
  total: 0,

  increase: (id) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              amount: item.amount + 1,
            }
          : item
      ),
    }));

    get().calculateTotals();
  },

  decrease: (id) => {
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                amount: item.amount - 1,
              }
            : item
        )
        .filter((item) => item.amount > 0),
    }));

    get().calculateTotals();
  },

  removeItem: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    }));

    get().calculateTotals();
  },

  clearCart: () => {
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    });
  },

  calculateTotals: () => {
    const { cartItems } = get();

    const amount = cartItems.reduce((sum, item) => sum + item.amount, 0);

    const total = cartItems.reduce(
      (sum, item) => sum + item.amount * Number(item.price),
      0
    );

    set({
      amount,
      total,
    });
  },
}));