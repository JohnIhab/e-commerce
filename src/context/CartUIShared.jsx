import { createContext } from "react";

export const CartUIContext = createContext({
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
});
