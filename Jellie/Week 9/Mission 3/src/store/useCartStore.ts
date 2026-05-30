import { create } from 'zustand';
import cartItems from '../constants/cartItems';
import type { CartItems } from '../types/cart';

type Store = {
  cartItems: CartItems;
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
};

export const useCartStore = create<Store>((set, get) => ({
  cartItems,
  amount: 0,
  total: 0,

  isOpen: false,

  increase: (id) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id
          ? { ...item, amount: item.amount + 1 }
          : item
      ),
    }));

    get().calculateTotals();
  },

  decrease: (id) => {
    const target = get().cartItems.find(
      (item) => item.id === id
    );

    if (!target) return;

    if (target.amount === 1) {
      get().removeItem(id);
      return;
    }

    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id
          ? { ...item, amount: item.amount - 1 }
          : item
      ),
    }));

    get().calculateTotals();
  },

  removeItem: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => item.id !== id
      ),
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
    const items = get().cartItems;

    let amount = 0;
    let total = 0;

    items.forEach((item) => {
      amount += item.amount;
      total += item.price * item.amount;
    });

    set({
      amount,
      total,
    });
  },

  openModal: () => {
    set({ isOpen: true });
  },

  closeModal: () => {
    set({ isOpen: false });
  },
}));