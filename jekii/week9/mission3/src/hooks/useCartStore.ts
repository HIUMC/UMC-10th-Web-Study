import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  openModal: () => void;
  closeModal: () => void;
}

interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
  isOpen: boolean;
  actions: CartActions;
}

const initialCartItems = cartItems.map((item) => ({ ...item }));

const getTotals = (items: CartItems) =>
  items.reduce(
    (acc, item) => ({
      amount: acc.amount + item.amount,
      total: acc.total + item.amount * item.price,
    }),
    { amount: 0, total: 0 },
  );

const initialTotals = getTotals(initialCartItems);

export const useCartStore = create<CartState>()(
  immer((set) => ({
    cartItems: initialCartItems,
    amount: initialTotals.amount,
    total: initialTotals.total,
    isOpen: false,
    actions: {
      increase: (id: string): void => {
        set((state) => {
          const item = state.cartItems.find((cartItem) => cartItem.id === id);

          if (item) {
            item.amount += 1;
          }

          const totals = getTotals(state.cartItems);
          state.amount = totals.amount;
          state.total = totals.total;
        });
      },
      decrease: (id: string): void => {
        set((state) => {
          const item = state.cartItems.find((cartItem) => cartItem.id === id);

          if (item) {
            item.amount -= 1;
          }

          const totals = getTotals(state.cartItems);
          state.amount = totals.amount;
          state.total = totals.total;
        });
      },
      removeItem: (id: string): void => {
        set((state) => {
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem.id !== id,
          );

          const totals = getTotals(state.cartItems);
          state.amount = totals.amount;
          state.total = totals.total;
        });
      },
      clearCart: (): void => {
        set((state) => {
          state.cartItems = [];
          state.amount = 0;
          state.total = 0;
        });
      },
      calculateTotals: (): void => {
        set((state) => {
          const totals = getTotals(state.cartItems);
          state.amount = totals.amount;
          state.total = totals.total;
        });
      },
      openModal: (): void => {
        set((state) => {
          state.isOpen = true;
        });
      },
      closeModal: (): void => {
        set((state) => {
          state.isOpen = false;
        });
      },
    },
  })),
);
