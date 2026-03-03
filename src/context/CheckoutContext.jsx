import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ApiAuthContext } from "./AuthContext";
import { Cart } from "./GetCartContext";
import { useNavigate } from "react-router-dom";

import PaymentFrame from "../Pages/CheckoutPage/PaymentFrame";
import { useTranslation } from "react-i18next";

export const CheckoutContext = createContext(null);

export default function CheckoutContextProvider({ children }) {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [guestInfo, setGuestInfo] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentPage, setPaymentPage] = useState("");
  const [guestData, setGuestData] = useState("");
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { setChanged } = useContext(Cart);

  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
  };
  useEffect(() => {
    if (showGuestModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showGuestModal]);

  async function placeOrder(values = {}) {
    const payload = {
      payment_method_id: Number(paymentMethod),
      source: "web",
    };

    // Authenticated user
    if (localStorage.getItem("token")) {
      payload.address_id = addressId;
    }
    // Guest user
    else if (!localStorage.getItem("token")) {
      if (values == {}) {
        setShowGuestModal(true);
        return;
      } else {
        payload.name = values.name;
        payload.email = values.email;
        payload.address = {
          country_id: values.country_id,
          state_id: values.state_id,
          city_id: values.city_id,
          address: values.address,
          phone: values.phone,
          postal_code: values.postal_code,
        };
      }
    }
    try {
      const response = await axios.post(`${baseUrl}/checkout`, payload, {
        headers: {
          "X-API-KEY": XApiKey,
          ...(localStorage.getItem("token")
            ? { Authorization: `${localStorage.getItem("token")}` }
            : localStorage.getItem("tempUserId")
            ? { "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}` }
            : {}),
        },
      });
      setChanged(Date.now());
      if (paymentMethod == 6) {
        // setPaymentPage(response.data.data.data);
        // console.log(response.data.data.data);
        // window.open(response.data.data.data, "_blank");
        const html = response.data.data.data; // HTML string from API
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        window.location.href = url;
        setIsPaying(true);

        // setIsPaying(true)
      } else if (paymentMethod == 1) {
        goTo(
          `/payment-status?status=success&order_code=${response?.data.data?.order_code}`
        );
      } else if (
        paymentMethod == 2 ||
        paymentMethod == 4 ||
        paymentMethod == 5 ||
        paymentMethod == 6 ||
        paymentMethod == 9 ||
        paymentMethod == 10
      ) {
        window.location.href = response.data.data.data;
      } else {
        toast.success("Order placed successfully");
      }

      return response.data;
    } catch (error) {
      console.error("Checkout error:", error);
      if (error?.response?.data?.message === "Oops! Something went wrong") {
        // toast.error(lang==="en"? "Please add address first":"من فضلك أضف عنوان أولاً");
        toast.error(t("checkout.addAddress"));
      } else {
        toast.error(error?.response?.data?.message || "Failed to place order");
      }
      throw error;
    } finally {
      setChanged(Date.now());
    }
  }

  return (
    <CheckoutContext.Provider
      value={{
        paymentMethod,
        setPaymentMethod,
        addressId,
        setAddressId,
        selectedAddress,
        setSelectedAddress,
        guestInfo,
        setGuestInfo,
        showGuestModal,
        setShowGuestModal,
        placeOrder,
        setGuestData,
        isPaying,
        paymentPage,
        setIsPaying,
        goTo,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}
