import { useContext } from "react";
import { CartUIContext } from "./CartUIShared";

export const useCartUI = () => useContext(CartUIContext);
