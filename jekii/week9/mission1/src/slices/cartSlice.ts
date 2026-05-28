import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItems } from "../types/cart";
import cartItems from "../constants/cartItems";

export interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
}

const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

// cartSlice 생성
// createSlice -> reduxToolkit에서 제공
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    //  증가
    increase: (state, action: PayloadAction<{ id: string }>): void => {
      const itemId = action.payload.id;
      // 이 아이디를 통해서, 전체 음반 중에 내가 클릭한 음반을 찾기
      const item = state.cartItems.find(
        (cartItem): boolean => cartItem.id === itemId,
      );

      if (item) {
        item.amount += 1;
      }
    },
    decrease: (state, action: PayloadAction<{ id: string }>): void => {
      const itemId = action.payload.id;
      // 이 아이디를 통해서, 전체 음반 중에 내가 클릭한 음반을 찾기
      const item = state.cartItems.find(
        (cartItem): boolean => cartItem.id === itemId,
      );

      if (item) {
        item.amount -= 1;
      }
    },
    removeItem: (state, action: PayloadAction<{ id: string }>): void => {
      const itemId = action.payload.id;
      state.cartItems = state.cartItems.filter(
        (cartItems) => cartItems.id !== itemId,
      );
    },
    // clearCart 장바구니 비우기
    clearCart: (state): void => {
      state.cartItems = [];
    },
    // 총액 계산
    calculateTotals: (state): void => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item): void => {
        amount += item.amount;
        total += item.amount * item.price;
      });

      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;

const cartReducer = cartSlice.reducer;
export default cartReducer;
