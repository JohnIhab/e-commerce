import React, { createContext, useContext, useState } from "react";
import { ApiAuthContext } from "./AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Cart } from "./GetCartContext";

export const addToCartContext = createContext(0);

export default function AddToCartContextProvider({ children }) {
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [addLoading, setAddLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [modalSlug, setModalSlug] = useState(null);
  const { setChanged } = useContext(Cart);
  

  async function addToCart(product_id, quantity = 1, variant_id = null) {
    setAddLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/carts`,
        { product_id, quantity, variant_id },
        {
          headers: {
            "X-API-KEY": XApiKey,
            ...(localStorage.getItem("token")
              ? { Authorization: `${localStorage.getItem("token")}` }
              : localStorage.getItem("tempUserId")
              ? { "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}` }
              : {}),
          },
        }
      );
      toast.success(response?.message || "Product Added Successfully", {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "500",
        },
      });
      if (
        !localStorage.getItem("token") &&
        !localStorage.getItem("tempUserId") &&
        response.data.data.temp_user_id
      ) {
        localStorage.setItem("tempUserId", response.data.data.temp_user_id);
      }
       // Trigger cart refresh after successful add
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
    <addToCartContext.Provider value={{ addToCart, addLoading , showModal, setShowModal, modalSlug, setModalSlug, showBundleModal, setShowBundleModal }}>
      {children}
    </addToCartContext.Provider>
  );
}
