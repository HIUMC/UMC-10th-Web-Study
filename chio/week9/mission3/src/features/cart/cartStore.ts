import { create } from "zustand";
import cartItems from "../../constants/cartItems";

export interface CartItemType {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

interface CartState {
  cartItems: CartItemType[];
  amount: number;
  total: number;
  clearCart: () => void;
  removeItem: (itemId: string) => void;
  increase: (itemId: string) => void;
  decrease: (itemId: string) => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems,
  amount: 0,
  total: 0,
  clearCart: () => {
    set({ cartItems: [] });
  },
  removeItem: (itemId) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== itemId),
    }));
  },
  increase: (itemId) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === itemId ? { ...item, amount: item.amount + 1 } : item,
      ),
    }));
  },
  decrease: (itemId) => {
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.id === itemId ? { ...item, amount: item.amount - 1 } : item,
        )
        .filter((item) => item.amount > 0),
    }));
  },
  calculateTotals: () => {
    const { cartItems } = get();
    const totals = cartItems.reduce(
      (cartTotal, item) => {
        cartTotal.amount += item.amount;
        cartTotal.total += item.amount * Number(item.price);
        return cartTotal;
      },
      { amount: 0, total: 0 },
    ); // reduce : 배열 순회 메소드

    set(totals);
  },
}));
