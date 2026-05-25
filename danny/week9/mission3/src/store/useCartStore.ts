import { create } from "zustand";
import { cartItems as initialCartItems } from "../constants/cartItems";
import type { CartStoreType } from "../types";

export const useCartStore = create<CartStoreType>((set) => ({
  // --- 1. 초기 상태 ---
  cartItems: initialCartItems,
  amount: 0,
  total: 0,
  isOpen: false,

  // --- 2. 액션 함수 (Cart) ---
  increase: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      ),
    })),

  decrease: (id) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item,
        )
        // 수량이 1 미만(0)이 되면 filter를 통해 배열에서 자동 제거
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
        total += item.amount * parseInt(item.price);
      });
      return { amount, total };
    }),

  // --- 3. 액션 함수 (Modal) ---
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
