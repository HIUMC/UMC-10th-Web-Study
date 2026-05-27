import { create } from 'zustand';
import cartItems from '../constants/cartItems';

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
  isOpen: boolean;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  openModal: () => void;
  closeModal: () => void;
}

const calcTotals = (items: CartItem[]) => ({
  amount: items.reduce((sum, item) => sum + item.amount, 0),
  total: items.reduce((sum, item) => sum + Number(item.price) * item.amount, 0),
});

export const useCartStore = create<CartStore>((set) => ({
  cartItems,
  ...calcTotals(cartItems),
  isOpen: false,

  increase: (id) =>
    set((state) => {
      const items = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );
      return { cartItems: items, ...calcTotals(items) };
    }),

  decrease: (id) =>
    set((state) => {
      const target = state.cartItems.find((item) => item.id === id);
      if (!target) return state;
      const items =
        target.amount - 1 < 1
          ? state.cartItems.filter((item) => item.id !== id)
          : state.cartItems.map((item) =>
              item.id === id ? { ...item, amount: item.amount - 1 } : item
            );
      return { cartItems: items, ...calcTotals(items) };
    }),

  removeItem: (id) =>
    set((state) => {
      const items = state.cartItems.filter((item) => item.id !== id);
      return { cartItems: items, ...calcTotals(items) };
    }),

  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),

  calculateTotals: () =>
    set((state) => calcTotals(state.cartItems)),

  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
