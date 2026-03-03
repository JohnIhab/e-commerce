import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckoutContext } from "../context/CheckoutContext";
import { Cart } from "../context/GetCartContext";
import { ApiAuthContext } from "../context/AuthContext";
import { userContext } from "../context/userContext";
import { useTranslation } from "react-i18next";

const OrderButton = (onclick = "") => {
  const { setChanged } = useContext(Cart);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  const {
    showGuestModal,
    setShowGuestModal,
    placeOrder,
    isPaying,
    paymentPage,
  } = useContext(CheckoutContext);

  const handleClick = () => {
    if (!animate) {
      setAnimate(true);
      if (localStorage.getItem("token")) {
        //  if(paymentMethod == 1 ){
        //    setTimeout(() => navigate("/invoice"), 9000);
        //  }
      } else {
        setShowGuestModal(true);
      }
    }
  };

  const { paymentMethod, addressId, guestInfo, setGuestInfo } =
    useContext(CheckoutContext);

  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { isLogged } = useContext(userContext);
  const { cart } = useContext(Cart);

  const { t } = useTranslation();

  useEffect(() => {
    let timer;
    if (animate) {
      timer = setTimeout(() => {
        setAnimate(false);
      }, 10000); // reset after animation
    }
    return () => clearTimeout(timer);
  }, [animate]);

  return (
    <>
      <style>{`
        :root {
          --primary: #275EFE;
          --primary-light: #7699FF;
          --  #1C212E;
          --grey-  #3F4656;
          --grey: #6C7486;
          --grey-light: #CDD9ED;
          --white: #FFF;
          --green: #16BF78;
          --sand: #DCB773;
          --sand-light: #EDD9A9;
        }

        .order {
          appearance: none;
          border: 0;
          background: var(--dark);
          position: relative;
          height: 63px;
          width: 240px;
          padding: 0;
          outline: none;
          cursor: pointer;
          border-radius: 32px;
          -webkit-mask-image: -webkit-radial-gradient(white, black);
          -webkit-tap-highlight-color: transparent;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .order span {
          --o: 1;
          position: absolute;
          left: 0;
          right: 0;
          text-align: center;
          top: 19px;
          line-height: 24px;
          color: var(--white);
          font-size: 16px;
          font-weight: 500;
          opacity: var(--o);
          transition: opacity 0.3s ease;
        }
        .order span.default {
          transition-delay: 0.3s;
        }
        .order span.success {
          --offset: 16px;
          --o: 0;
        }
        .order span.success svg {
          width: 12px;
          height: 10px;
          display: inline-block;
          vertical-align: top;
          fill: none;
          margin: 7px 0 0 4px;
          stroke: var(--green);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 16px;
          stroke-dashoffset: var(--offset);
          transition: stroke-dashoffset 0.3s ease;
        }
        .order:active {
          transform: scale(0.96);
        }
        .order .lines {
          opacity: 0;
          position: absolute;
          height: 3px;
          background: var(--white);
          border-radius: 2px;
          width: 6px;
          top: 30px;
          left: 100%;
          box-shadow: 15px 0 0 var(--white), 30px 0 0 var(--white), 45px 0 0 var(--white),
            60px 0 0 var(--white), 75px 0 0 var(--white), 90px 0 0 var(--white),
            105px 0 0 var(--white), 120px 0 0 var(--white), 135px 0 0 var(--white),
            150px 0 0 var(--white), 165px 0 0 var(--white), 180px 0 0 var(--white),
            195px 0 0 var(--white), 210px 0 0 var(--white), 225px 0 0 var(--white),
            240px 0 0 var(--white), 255px 0 0 var(--white), 270px 0 0 var(--white),
            285px 0 0 var(--white), 300px 0 0 var(--white), 315px 0 0 var(--white),
            330px 0 0 var(--white);
        }
        .order .back,
        .order .box {
          --start: var(--white);
          --stop: var(--grey-light);
          border-radius: 2px;
          background: linear-gradient(var(--start), var(--stop));
          position: absolute;
        }
        .order .truck {
          width: 60px;
          height: 41px;
          left: 100%;
          z-index: 1;
          top: 11px;
          position: absolute;
          transform: translateX(24px);
        }
        .order .truck:before,
        .order .truck:after {
          --r: -90deg;
          content: "";
          height: 2px;
          width: 20px;
          right: 58px;
          position: absolute;
          display: block;
          background: var(--white);
          border-radius: 1px;
          transform-origin: 100% 50%;
          transform: rotate(var(--r));
        }
        .order .truck:before {
          top: 4px;
        }
        .order .truck:after {
          --r: 90deg;
          bottom: 4px;
        }
        .order .truck .back {
          left: 0;
          top: 0;
          width: 60px;
          height: 41px;
          z-index: 1;
        }
        .order .truck .front {
          overflow: hidden;
          position: absolute;
          border-radius: 2px 9px 9px 2px;
          width: 26px;
          height: 41px;
          left: 60px;
        }
        .order .truck .front:before,
        .order .truck .front:after {
          content: "";
          position: absolute;
          display: block;
        }
        .order .truck .front:before {
          height: 13px;
          width: 2px;
          left: 0;
          top: 14px;
          background: linear-gradient(var(--grey), var(--grey-dark));
        }
        .order .truck .front:after {
          border-radius: 2px 9px 9px 2px;
          background: var(--primary);
          width: 24px;
          height: 41px;
          right: 0;
        }
        .order .truck .front .window {
          overflow: hidden;
          border-radius: 2px 8px 8px 2px;
          background: var(--primary-light);
          transform: perspective(4px) rotateY(3deg);
          width: 22px;
          height: 41px;
          position: absolute;
          left: 2px;
          top: 0;
          z-index: 1;
          transform-origin: 0 50%;
        }
        .order .truck .front .window:before,
        .order .truck .front .window:after {
          content: "";
          position: absolute;
          right: 0;
        }
        .order .truck .front .window:before {
          top: 0;
          bottom: 0;
          width: 14px;
          background: var(--dark);
        }
        .order .truck .front .window:after {
          width: 14px;
          top: 7px;
          height: 4px;
          position: absolute;
          background: rgba(255, 255, 255, 0.14);
          transform: skewY(14deg);
          box-shadow: 0 7px 0 rgba(255, 255, 255, 0.14);
        }
        .order .truck .light {
          width: 3px;
          height: 8px;
          left: 83px;
          transform-origin: 100% 50%;
          position: absolute;
          border-radius: 2px;
          transform: scaleX(0.8);
          background: #f0dc5f;
        }
        .order .truck .light:before {
          content: "";
          height: 4px;
          width: 7px;
          opacity: 0;
          transform: perspective(2px) rotateY(-15deg) scaleX(0.94);
          position: absolute;
          transform-origin: 0 50%;
          left: 3px;
          top: 50%;
          margin-top: -2px;
          background: linear-gradient(
            90deg,
            #f0dc5f,
            rgba(240, 220, 95, 0.7),
            rgba(240, 220, 95, 0)
          );
        }
        .order .truck .light.top {
          top: 4px;
        }
        .order .truck .light.bottom {
          bottom: 4px;
        }
        .order .box {
          --start: var(--sand-light);
          --stop: var(--sand);
          width: 21px;
          height: 21px;
          right: 100%;
          top: 21px;
        }
        .order .box:before,
        .order .box:after {
          content: "";
          top: 10px;
          position: absolute;
          left: 0;
          right: 0;
        }
        .order .box:before {
          height: 3px;
          margin-top: -1px;
          background: rgba(0, 0, 0, 0.1);
        }
        .order .box:after {
          height: 1px;
          background: rgba(0, 0, 0, 0.15);
        }
        .order.animate .default {
          --o: 0;
          transition-delay: 0s;
        }
        .order.animate .success {
          --offset: 0;
          --o: 1;
          transition-delay: 7s;
        }
        .order.animate .success svg {
          transition-delay: 7.3s;
        }
        .order.animate .truck {
          animation: truck 10s ease forwards;
        }
        .order.animate .truck:before {
          animation: door1 2.4s ease forwards 0.3s;
        }
        .order.animate .truck:after {
          animation: door2 2.4s ease forwards 0.6s;
        }
        .order.animate .truck .light:before,
        .order.animate .truck .light:after {
          animation: light 10s ease forwards;
        }
        .order.animate .box {
          animation: box 10s ease forwards;
        }
        .order.animate .lines {
          animation: lines 10s ease forwards;
        }

        @keyframes truck {
          10%, 30% {
            transform: translateX(-164px);
          }
          40% {
            transform: translateX(-104px);
          }
          60% {
            transform: translateX(-224px);
          }
          75%, 100% {
            transform: translateX(24px);
          }
        }
        @keyframes lines {
          0%, 30% {
            opacity: 0;
            transform: scaleY(0.7) translateX(0);
          }
          35%, 65% {
            opacity: 1;
          }
          70% {
            opacity: 0;
          }
          100% {
            transform: scaleY(0.7) translateX(-400px);
          }
        }
        @keyframes light {
          0%, 30% {
            opacity: 0;
            transform: perspective(2px) rotateY(-15deg) scaleX(0.88);
          }
          40%, 100% {
            opacity: 1;
            transform: perspective(2px) rotateY(-15deg) scaleX(0.94);
          }
        }
        @keyframes door1 {
          30%, 50% {
            transform: rotate(32deg);
          }
        }
        @keyframes door2 {
          30%, 50% {
            transform: rotate(-32deg);
          }
        }
        @keyframes box {
          8%, 10% {
            transform: translateX(40px);
            opacity: 1;
          }
          25% {
            transform: translateX(112px);
            opacity: 1;
          }
          26% {
            transform: translateX(112px);
            opacity: 0;
          }
          27%, 100% {
            transform: translateX(0px);
            opacity: 0;
          }
        }
      `}</style>

      <button
        type="button"
        className={`order  ${animate ? "animate" : ""}`}
        // onClick={async () => {
        //   handleClick();
        //   // placeOrder();

        //   // try {
        //   //   if (isLogged) {
        //   //     if (!addressId) {
        //   //       console.warn("Attempt to checkout without an address");
        //   //       toast.error("Please select a delivery address");
        //   //       setTimeout(() => setAnimate(false), 1000);
        //   //       return;
        //   //     }
        //   //     if (
        //   //       paymentMethod === null ||
        //   //       paymentMethod === undefined ||
        //   //       paymentMethod === ""
        //   //     ) {
        //   //       console.warn("Attempt to checkout without a payment method");
        //   //       toast.error("Please select a payment method");
        //   //       setTimeout(() => setAnimate(false), 1000);
        //   //       return;
        //   //     }

        //   //     const pmId = Number(paymentMethod);
        //   //     if (isNaN(pmId)) {
        //   //       console.warn(
        //   //         "Payment method is not numeric; aborting request",
        //   //         paymentMethod
        //   //       );
        //   //       toast.error("Invalid payment method selected");
        //   //       setTimeout(() => setAnimate(false), 1000);
        //   //       return;
        //   //     }

        //   //     const headers = {
        //   //       "X-API-KEY": XApiKey,
        //   //       ...(localStorage.getItem("token")
        //   //         ? { Authorization: `${localStorage.getItem("token")}` }
        //   //         : localStorage.getItem("tempUserId")
        //   //         ? {
        //   //             "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}`,
        //   //           }
        //   //         : {}),
        //   //     };

        //   //     const payload = {
        //   //       payment_method_id: pmId,
        //   //       address_id: addressId,
        //   //     };

        //   //     console.log("Checkout payload (auth):", payload);
        //   //     console.log("Checkout headers (auth):", headers);

        //   //     const { data, status } = await axios.post(
        //   //       `${baseUrl}/checkout`,
        //   //       payload,
        //   //       { headers }
        //   //     );
        //   //     console.log("Checkout response status:", status);
        //   //     console.log("Checkout response data:", data);

        //   //     const isServerReportedError = !!(
        //   //       data &&
        //   //       (data.success === false ||
        //   //         data.status === "error" ||
        //   //         (typeof data.message === "string" &&
        //   //           /oops|error|failed/i.test(data.message)))
        //   //     );
        //   //     if (isServerReportedError) {
        //   //       console.warn(
        //   //         "Checkout reported failure by server:",
        //   //         data.message || data
        //   //       );
        //   //       toast.error(data?.message || "Failed to place order");
        //   //       setTimeout(() => setAnimate(false), 1000);
        //   //       return;
        //   //     }

        //   //     if (data?.message)
        //   //       console.log("Checkout response message:", data.message);
        //   //     toast.success("Order placed successfully");
        //   //     setTimeout(() => navigate("/invoice"), 9000);
        //   //   } else {
        //   //     if (!guestInfo && typeof setShowGuestModal === "function") {
        //   //       setShowGuestModal(true);
        //   //       return;
        //   //     }
        //   //     const tempId = localStorage.getItem("tempUserId");
        //   //     if (
        //   //       (!cart || !(cart.items && cart.items.length > 0)) &&
        //   //       !tempId &&
        //   //       !localStorage.getItem("token")
        //   //     ) {
        //   //       console.warn(
        //   //         "Guest checkout blocked: cart empty and no tempUserId"
        //   //       );
        //   //       toast.error("Cart is empty");
        //   //       setTimeout(() => setAnimate(false), 300);
        //   //       return;
        //   //     }

        //   //     const info = guestInfo;
        //   //     if (!info?.name || !info?.email || !info?.address) {
        //   //       console.warn(
        //   //         "Guest info incomplete, opening guest modal",
        //   //         info
        //   //       );
        //   //       // open guest modal to complete details
        //   //       if (typeof setShowGuestModal === "function")
        //   //         setShowGuestModal(true);
        //   //       toast.error(
        //   //         "Please complete your contact and delivery details"
        //   //       );
        //   //       setTimeout(() => setAnimate(false), 1000);
        //   //       return;
        //   //     }
        //   //     const payload = {
        //   //       payment_method_id: isNaN(Number(paymentMethod))
        //   //         ? paymentMethod
        //   //         : Number(paymentMethod),
        //   //       name: info?.name,
        //   //       email: info?.email,
        //   //       address: info?.address,
        //   //     };

        //   //     const headers = { "X-API-KEY": XApiKey };
        //   //     if (localStorage.getItem("token"))
        //   //       headers.Authorization = localStorage.getItem("token");
        //   //     else if (localStorage.getItem("tempUserId"))
        //   //       headers["X-Temp-User-Id"] = localStorage.getItem("tempUserId");

        //   //     console.log("Checkout payload (guest):", payload);
        //   //     console.log("Checkout headers (guest):", headers);

        //   //     const { data, status } = await axios.post(
        //   //       `${baseUrl}/checkout`,
        //   //       payload,
        //   //       { headers }
        //   //     );
        //   //     console.log("Checkout response status:", status);
        //   //     console.log("Checkout response data:", data);

        //   //     const isServerReportedErrorGuest = !!(
        //   //       data &&
        //   //       (data.success === false ||
        //   //         data.status === "error" ||
        //   //         (typeof data.message === "string" &&
        //   //           /oops|error|failed/i.test(data.message)))
        //   //     );
        //   //     if (isServerReportedErrorGuest) {
        //   //       console.warn(
        //   //         "Guest checkout reported failure by server:",
        //   //         data.message || data
        //   //       );
        //   //       if (data?.errors) {
        //   //         console.warn("Server errors:", data.errors);
        //   //         if (typeof data.errors === "string") toast.error(data.errors);
        //   //         else toast.error(data?.message || "Failed to place order");
        //   //       } else {
        //   //         toast.error(data?.message || "Failed to place order");
        //   //       }
        //   //       setTimeout(() => setAnimate(false), 1000);
        //   //       return;
        //   //     }

        //   //     if (data?.message)
        //   //       console.log("Checkout response message:", data.message);
        //   //     toast.success("Order placed successfully");
        //   //     // setTimeout(() => navigate('/invoice'), 9000);
        //   //   }
        //   //   setChanged(Date.now());
        //   // } catch (err) {
        //   //   console.error(
        //   //     "Checkout error",
        //   //     err?.response || err?.message || err
        //   //   );
        //   //   if (err?.response?.data?.message)
        //   //     console.log("Checkout error message:", err.response.data.message);
        //   //   toast.error("Failed to place order");
        //   //   setTimeout(() => setAnimate(false), 1000);
        //   // }
        // }}
        onClick={() => {
          if (localStorage.getItem("token")) {
            placeOrder();  
          } else {
            setShowGuestModal(true);  
          }
        }}
      >
        <span className="default">{t("guestCheckout.Place Order")}</span>
        <span className="success">
          {t("guestCheckout.Order Placed")}
          <svg viewBox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
          </svg>
        </span>
        <div className="box"></div>
        <div className="truck">
          <div className="back"></div>
          <div className="front">
            <div className="window"></div>
          </div>
          <div className="light top"></div>
          <div className="light bottom"></div>
        </div>
        <div className="lines"></div>
      </button>
    </>
  );
};

export default OrderButton;
