import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import cartItems from '../constants/cartItems';
import type { CartItems } from '../types/cart';

type CartState = {
  cartItems: CartItems;
  amount: number;
  total: number;
};

const initialState: CartState = {
  cartItems,
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    increase: (state, action: PayloadAction<{ id: string }>) => {
      const item = state.cartItems.find(
        (cartItem) => cartItem.id === action.payload.id
      );

      if (item) {
        item.amount += 1;
      }
    },

    decrease: (state, action: PayloadAction<{ id: string }>) => {
      const item = state.cartItems.find(
        (cartItem) => cartItem.id === action.payload.id
      );

      if (item) {
        item.amount -= 1;
      }
    },

    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },

    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.price * item.amount;
      });

      state.amount = amount;
      state.total = total;
    },
  },
});

export const {
  increase,
  decrease,
  removeItem,
  clearCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;