import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cartItems, { CartItem } from '../../constants/cartItems';

type CartState = {
  cartItems: CartItem[];
  amount: number;
  total: number;
};

function getTotals(items: CartItem[]) {
  return items.reduce(
    (acc, item) => {
      acc.amount += item.amount;
      acc.total += Number(item.price) * item.amount;
      return acc;
    },
    { amount: 0, total: 0 }
  );
}

const totals = getTotals(cartItems);

const initialState: CartState = {
  cartItems,
  amount: totals.amount,
  total: totals.total,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload);

      if (item) {
        item.amount += 1;
      }
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload);

      if (!item) {
        return;
      }

      if (item.amount === 1) {
        state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload);
        return;
      }

      item.amount -= 1;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      const nextTotals = getTotals(state.cartItems);
      state.amount = nextTotals.amount;
      state.total = nextTotals.total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
