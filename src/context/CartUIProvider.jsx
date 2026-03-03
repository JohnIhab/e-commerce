import React, { useMemo, useState } from "react";
import { CartUIContext } from "./CartUIShared";

export const CartUIProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const value = useMemo(
    () => ({
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      toggleCart: () => setIsCartOpen((s) => !s),
    }),
    [isCartOpen]
  );

  return (
    <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>
  );
};
