import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../../constants/cartItems';

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
}

const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const cartItem = state.cartItems.find((item) => item.id === itemId);
      if (cartItem) {
        cartItem.amount += 1;
      }
    },
    decrease: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const cartItem = state.cartItems.find((item) => item.id === itemId);
      if (cartItem) {
        cartItem.amount -= 1;
        if (cartItem.amount < 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
        }
      }
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * Number(item.price);
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
