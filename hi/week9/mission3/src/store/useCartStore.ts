import { create } from 'zustand';
import { cartItems as initialCartItems } from '../constants/cartItems';
import type { CartItem } from '../types/cart';

interface CartState {
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

export const useCartStore = create<CartState>((set) => ({
  cartItems: initialCartItems,
  amount: 0,
  total: 0,
  isOpen: false,

  increase: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      ),
    })),

  decrease: (id) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
        .filter((item) => item.amount > 0),
    })),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),

  calculateTotals: () =>
    set((state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += Number(item.price) * item.amount;
      });

      return {
        amount,
        total,
      };
    }),

  openModal: () =>
    set({
      isOpen: true,
    }),

  closeModal: () =>
    set({
      isOpen: false,
    }),
}));