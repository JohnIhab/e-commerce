import React, { createContext, useContext, useState } from "react";
import { ApiAuthContext } from "./AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Cart } from "./GetCartContext";

export const deleteCartContext = createContext(0);

export default function DeleteCartContextProvider({ children }) {
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [addLoading, setAddLoading] = useState(false);
  const { setChanged } = useContext(Cart);
  async function clearCart() {
    try {
      const response = await axios.delete(`${baseUrl}/carts/clear`, {
        headers: {
          "X-API-KEY": XApiKey,
          ...(localStorage.getItem("token")
            ? { Authorization: `${localStorage.getItem("token")}` }
            : localStorage.getItem("tempUserId")
            ? { "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}` }
            : {}),
        },
      });
      toast.success(response?.message || "Cart cleared Successfully", {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "500",
        },
      });
      setChanged(Date.now());
    } catch {}
  }

  async function deleteCart(product_id) {
    setAddLoading(true);
    try {
      const response = await axios.delete(`${baseUrl}/carts/${product_id}`, {
        headers: {
          "X-API-KEY": XApiKey,
          ...(localStorage.getItem("token")
            ? { Authorization: `${localStorage.getItem("token")}` }
            : localStorage.getItem("tempUserId")
            ? { "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}` }
            : {}),
        },
      });
      toast.success(response?.message || "Product Deleted Successfully", {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "500",
        },
      });

      // Trigger cart refresh after successful delete
      setChanged(Date.now());
      setAddLoading(false);
    } catch (error) {
      console.error(error.response?.data || error.message);

      toast.error(error.response?.data.message, {
        duration: 2000,
      });
      console.error(error.response?.data.message);

      setAddLoading(false);
    }
  }

  async function deleteBundleCart(bundle_offer_id) {
    setAddLoading(true);
     
    try {
      const response = await axios.delete(`${baseUrl}/carts/bundle-offer`, {
        data:{bundle_offer_id},
        headers: {
          "X-API-KEY": XApiKey,
          ...(localStorage.getItem("token")
            ? { Authorization: `${localStorage.getItem("token")}` }
            : localStorage.getItem("tempUserId")
            ? { "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}` }
            : {}),
        },
      });
      toast.success(response?.message || "Bundle Deleted Successfully", {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "500",
        },
      });

      // Trigger cart refresh after successful delete
      setChanged(Date.now());
      setAddLoading(false);
    } catch (error) {
      console.error(error.response?.data || error.message);

      toast.error(error.response?.data.message, {
        duration: 2000,
      });
      console.error(error.response?.data.message);

      setAddLoading(false);
    }
  }
  return (
    <deleteCartContext.Provider value={{ deleteCart,clearCart, addLoading, deleteBundleCart }}>
      {children}
    </deleteCartContext.Provider>
  );
}
