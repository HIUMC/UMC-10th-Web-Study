export interface CartItemType {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

export interface CartStoreType {
  cartItems: CartItemType[];
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
