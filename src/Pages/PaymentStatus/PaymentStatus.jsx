import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { ApiAuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Invoice from "../InvoicePage/Invoice";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { RiCloseLargeLine, RiSecurePaymentFill } from "react-icons/ri";
import { IoMdCloseCircle } from "react-icons/io";


const PaymentStatus = () => {
  const { t } = useTranslation();

  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [status, setStatus] = useState(null);
  const [orderCode, setOrderCode] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStatus(params.get("status"));
    setOrderCode(params.get("order_code"));
   }, []);

  async function paymentStatus() {
    const response = await axios.get(`${baseUrl}/orders/${orderCode}`, {
      headers: {
        "X-API-KEY": XApiKey,
        Authorization: `${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  }
  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["paymentStatus"],
    queryFn: paymentStatus,
    enabled: !!orderCode,
  });

  useEffect(() => {
    if (data) {
     } else {
      console.log(error);
    }
  }, [data, isError]);

  // if(paymentStatus == "success"){
  //   return <Invoice/>
  // }
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  };

  return (
    <>
      {status == "success" ? (
        <Invoice invoiceData={data} />
      ) : (
        <div className="py-30 flex items-center justify-center bg-gradient-to-br from-third/50 via-white to-[#202B2C]/10 px-6  ">
          <motion.main
            className="relative max-w-4xl w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/60 p-8 md:p-12"
            initial="hidden"
            animate="show"
            variants={container}
            aria-labelledby="page-title"
          >
            <motion.svg
              viewBox="0 0 200 200"
              className="absolute -top-12 -left-12 w-48 h-48 opacity-30"
              xmlns="http://www.w3.org/2000/svg"
              variants={{
                hidden: { scale: 0.8, opacity: 0 },
                show: {
                  scale: 1,
                  opacity: 0.28,
                  transition: { duration: 0.8 },
                },
              }}
            >
              <defs>
                <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="red" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#3A4B4C" stopOpacity="0.65" />
                </linearGradient>
              </defs>
              <path
                fill="url(#g1)"
                d="M43.8,-64.2C57.9,-55.3,70.3,-44.1,73.7,-30.1C77.1,-16.1,71.4,-0.3,63.4,12.8C55.4,25.9,45.1,36.6,33.0,44.6C20.9,52.6,6.9,57.9,-5.8,61.3C-18.5,64.7,-31.9,66.1,-42.4,59.9C-52.9,53.6,-60.5,39.9,-65.8,25.6C-71.1,11.3,-74.1,-3.6,-68.6,-17.2C-63.1,-30.9,-49.1,-43.3,-33.6,-52.2C-18.1,-61.1,-9.1,-66.5,3.7,-71.1C16.6,-75.7,33.2,-79.1,43.8,-64.2Z"
                transform="translate(100 100)"
              />
            </motion.svg>

            <motion.svg
              viewBox="0 0 100 100"
              className="absolute -bottom-10 -right-8 w-36 h-36 opacity-20"
              xmlns="http://www.w3.org/2000/svg"
              variants={{
                hidden: { scale: 0.6, opacity: 0 },
                show: {
                  scale: 1,
                  opacity: 0.2,
                  transition: { delay: 0.2, duration: 0.8 },
                },
              }}
            >
              <circle cx="50" cy="50" r="40" fill="#E9F1F0" />
              <g fill="red" opacity="0.9">
                <path d="M30 35c0-8 14-12 22-12s22 4 22 12v1H30z" />
              </g>
            </motion.svg>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div className="flex-shrink-0" variants={item}>
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-red-600 to-third flex items-center justify-center shadow-2xl text-white relative overflow-visible">
                  <div className="relative">
                    <RiSecurePaymentFill size={150} className="" />
                     <IoMdCloseCircle size={50}  className=" font-bold absolute end-5 top-20 text-red-700 bg-primary rounded-full "  />

                  </div>

                  <motion.div
                    className="absolute -top-4 -right-6 w-10 h-10 md:w-12 md:h-12 p-1"
                    initial={{ scale: 0.6, y: -6, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                  >
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <rect
                        x="2"
                        y="4"
                        width="20"
                        height="14"
                        rx="2"
                        fill="#E6F0EF"
                        stroke="red"
                      />
                      <path
                        d="M8 4v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V4"
                        fill="none"
                        stroke="red"
                        strokeWidth="0.8"
                      />
                    </svg>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-3 -left-5 w-8 h-8 md:w-10 md:h-10 p-1"
                    initial={{ scale: 0.6, y: 6, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.35, type: "spring", stiffness: 110 }}
                  >
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <rect
                        x="3"
                        y="6"
                        width="18"
                        height="12"
                        rx="1.5"
                        fill="#F5F7F6"
                        stroke="red"
                      />
                      <path
                        d="M7 6v-1a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V6"
                        fill="none"
                        stroke="red"
                        strokeWidth="0.7"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              <div className="flex-1 text-center md:text-left">
                <motion.h1
                  id="page-title"
                  className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2 text-red-700"
                  variants={item}
                >
                  {t("paymentFailed.title")}
                </motion.h1>

                <motion.p
                  className="text-black dark:text-black mb-6 text-base md:text-lg"
                  variants={item}
                >
                  {t("paymentFailed.subtitle")}
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start"
                  variants={item}
                >
                  <Link
                    to="/checkout"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-primary text-third hover:bg-third hover:border-secondary hover:text-primary    duration-300 font-medium shadow hover:scale-[1.1] transform transition"
                  >
                    {t("paymentFailed.tryAgain")}
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* small helper footnote */}
            
          </motion.main>
        </div>
      )}
    </>
  );
};

export default PaymentStatus;
