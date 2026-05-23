import { create } from 'zustand';
import type { CartItem } from '../constants/cartItems';
import cartItems from '../constants/cartItems';

interface CartStore {
  // 장바구니 상태
  cartItems: CartItem[];
  amount: number;
  total: number;
  // 모달 상태
  isOpen: boolean;

  // 장바구니 액션
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;

  // 모달 액션
  openModal: () => void;
  closeModal: () => void;
  confirmClear: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cartItems: cartItems,
  amount: cartItems.length,
  total: 0,
  isOpen: false,

  increase: (id) =>
    set((state) => {
      const updated = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );
      const amount = updated.reduce((sum, item) => sum + item.amount, 0);
      const total = updated.reduce((sum, item) => sum + item.amount * Number(item.price), 0);
      return { cartItems: updated, amount, total };
    }),

  decrease: (id) =>
    set((state) => {
      const updated = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
        .filter((item) => item.amount > 0);
      const amount = updated.reduce((sum, item) => sum + item.amount, 0);
      const total = updated.reduce((sum, item) => sum + item.amount * Number(item.price), 0);
      return { cartItems: updated, amount, total };
    }),

  removeItem: (id) =>
    set((state) => {
      const updated = state.cartItems.filter((item) => item.id !== id);
      const amount = updated.reduce((sum, item) => sum + item.amount, 0);
      const total = updated.reduce((sum, item) => sum + item.amount * Number(item.price), 0);
      return { cartItems: updated, amount, total };
    }),

  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),

  calculateTotals: () =>
    set((state) => ({
      amount: state.cartItems.reduce((sum, item) => sum + item.amount, 0),
      total: state.cartItems.reduce(
        (sum, item) => sum + item.amount * Number(item.price),
        0
      ),
    })),

  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),

  // 모달에서 "네" 누르면: clearCart + closeModal 한번에
  confirmClear: () => set({ cartItems: [], amount: 0, total: 0, isOpen: false }),
}));
