export interface CartItemType {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

export interface CartState {
  cartItems: CartItemType[];
  amount: number;
  total: number;
}
