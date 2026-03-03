import React, { useContext, useEffect, useState } from "react";
import AddressRadio from "./AddressRadio";
import PaymentMethods from "./PaymentMethods";
import Order from "./Order";
import Summary from "./Summary";
import { Helmet } from "react-helmet";
import Login from "../LoginPage/Login";
import { FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { userContext } from "../../context/userContext";
import empty from "../../assets/Cart/Empty.png";
import AddressContextProvider, {
  AddressContext,
} from "./../../context/AddressContext";
import CheckoutContextProvider from "../../context/CheckoutContext";
import GuestCheckoutForm from "./GuestCheckoutForm";
import { useTranslation } from "react-i18next";
import { Cart } from "../../context/GetCartContext";
import { Link } from "react-router-dom";
const Checkout = () => {
  const { isLogged, setIsLogged } = useContext(userContext);
  const [isLoginModel, setIsLoginModel] = useState(false);
  const {addressChanged} = useContext(AddressContext)
  const { cartCounter } = useContext(Cart);
  

  const { t } = useTranslation();

  if (cartCounter == 0) {
    return (
      <>
        <div className="py-10">
          <div className="w-full flex justify-center items-center gap-5 flex-col pb-10 text-xl font-bold">
            <img src={empty} className="w-100 my-2" alt="" />
            <h3>{t("cart.empty")}</h3>

            <div>
              <Link
                to="/shop"
                className="bg-third text-primary border-third border rounded-lg hover:bg-primary hover:text-third font-bold text-2xl my-3 px-3 py-1 duration-500"
              >
                {t("cart.shopNow")}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{"JootBag | Checkout"}</title>
        <meta name="description" content="JootBagCheckout" />
      </Helmet>

   <div className="pt-25">
       {!isLogged ? (
        <div className="pt-5 flex justify-start lg:px-25 px-10 w-full ">
          <button
            className="p-3 rounded-lg bg-[#1E2939] text-white "
            onClick={(e) => {
              setIsLoginModel(true);
            }}
          >
            {t("guestCheckout.Login Now")}
          </button>
        </div>
      ) : null}
      <CheckoutContextProvider>
        
          <div key={addressChanged} className="flex w-full  flex-col lg:flex-row  gap-10 lg:px-25 px-10 pb-10  ">
            <div className="lg:w-9/12 order-0">
              <div className="w-full">{isLogged ? <AddressRadio /> : null}</div>
              <div className="w-full ">
                <Order />
              </div>
            </div>
            <div className=" lg:w-9/12 order-2 lg:order-1">
              <PaymentMethods />
            </div>
            <div className=" lg:w-9/12 order-1 lg:order-2">
              <Summary />
            </div>
          </div>

          {/* Guest checkout modal rendered at page level so it overlays correctly */}
          <GuestCheckoutForm />

          {!isLogged ? (
            <AnimatePresence>
              {isLoginModel && (
                <motion.div
                  className="fixed w-full h-full inset-0 backdrop-blur-2xl z-900 flex flex-col justify-center"
                  onClick={() => setIsLoginModel(false)}
                  // Animation for showing/hiding modal background
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="w-full justify-center flex flex-col   items-center">
                    <motion.div
                      className="relative w-11/12 md:w-6/12   lg:w-4/12 flex justify-end z-[9000]"
                      onClick={(e) => e.stopPropagation()}
                      initial={{ scale: 0.8, opacity: 0, y: 30 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0, y: 30 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <FaXmark
                        onClick={() => setIsLoginModel(false)}
                        className="m-3 bg-red-900 rounded-full p-1 text-white cursor-pointer hover:rotate-90 transition-transform duration-300"
                        size={40}
                      />
                    </motion.div>

                    {/* Login component itself */}
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 40, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-11/12 md:w-6/12 lg:w-4/12"
                    >
                      <Login />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : null}
          {/* {isLoginModel ? (
        <div
          className="fixed w-full h-full inset-0 backdrop-blur-2xl z-900 flex flex-col justify-center"
          onClick={() => {
            setIsLoginModel(false);
          }}
        >
          <div className="w-full justify-center flex flex-col   items-center">
            <div className=" relative w-11/12 md:w-6/12 lg:w-4/12    flex justify-end   z-[9000]">
              <FaXmark
                onClick={() => {
                  setIsLoginModel(false);
                }}
                className="m-3 bg-red-900 rounded-full p-1 text-white cursor-pointer"
                size={40}
              />
            </div>
            <Login />
          </div>
        </div>
      ) : null} */}
       
      </CheckoutContextProvider>
   </div>
    </>
  );
};

export default Checkout;
