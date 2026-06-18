import { create } from 'zustand';
import cartItems, { CartItem } from '../constants/cartItems';

type Totals = {
  amount: number;
  total: number;
};

type PlaylistState = {
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
  confirmClearCart: () => void;
};

function getTotals(items: CartItem[]): Totals {
  return items.reduce(
    (acc, item) => {
      acc.amount += item.amount;
      acc.total += Number(item.price) * item.amount;
      return acc;
    },
    { amount: 0, total: 0 }
  );
}

function syncTotals(items: CartItem[]) {
  const totals = getTotals(items);

  return {
    cartItems: items,
    amount: totals.amount,
    total: totals.total,
  };
}

const initialTotals = getTotals(cartItems);

export const usePlaylistStore = create<PlaylistState>((set) => ({
  cartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
  isOpen: false,
  increase: (id) =>
    set((state) => {
      const nextItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );

      return syncTotals(nextItems);
    }),
  decrease: (id) =>
    set((state) => {
      const nextItems = state.cartItems
        .map((item) => (item.id === id ? { ...item, amount: item.amount - 1 } : item))
        .filter((item) => item.amount > 0);

      return syncTotals(nextItems);
    }),
  removeItem: (id) =>
    set((state) => {
      const nextItems = state.cartItems.filter((item) => item.id !== id);

      return syncTotals(nextItems);
    }),
  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),
  calculateTotals: () =>
    set((state) => {
      const totals = getTotals(state.cartItems);

      return {
        amount: totals.amount,
        total: totals.total,
      };
    }),
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  confirmClearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
      isOpen: false,
    }),
}));
