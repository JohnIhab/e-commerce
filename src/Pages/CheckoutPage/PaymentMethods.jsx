import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaApplePay } from "react-icons/fa";
import { BiLogoMastercard } from "react-icons/bi";
import { RiVisaLine } from "react-icons/ri";
import { HiOutlineCash } from "react-icons/hi";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import OrderButton from "./../../Components/OrderButton";
import { CheckoutContext } from "../../context/CheckoutContext";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ApiAuthContext } from "../../context/AuthContext";
import Loader from "../../Components/Loader";
import { SettingsContext } from "../../context/Settings";

const PaymentMethods = () => {
  const [showModal, setShowModal] = useState(false);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { thirdColor } = useContext(SettingsContext);

  function handlePayment(values) {}
  const paymentFormik = useFormik({
    initialValues: {
      payment: "",
    },
    onSubmit: handlePayment,
  });
  const { setPaymentMethod, isPaying, paymentPage, setIsPaying } =
    useContext(CheckoutContext);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);

  useEffect(() => {
    async function fetchMethods() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${baseUrl}/payment-methods`, {
          headers: {
            "X-API-KEY": XApiKey,
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = res?.data?.data ?? res?.data ?? [];
        setMethods(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          const firstValue = first.code ?? first.title_en ?? "";
          paymentFormik.setFieldValue("payment", firstValue);
          if (setPaymentMethod) setPaymentMethod(first.id ?? firstValue);
        }
      } catch (err) {
        setError(err?.message || "Failed to load payment methods");
      } finally {
        setLoading(false);
      }
    }

    fetchMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, XApiKey]);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  return (
    <StyledWrapper thirdColor={thirdColor}>
      <div className="radio-inputs py-5 !flex relative">
        <h3 className="text-2xl font-bold w-full text-start ">
          Payment Methods
        </h3>

        <div className="w-full   flex gap-3 flex-wrap justify-center">
          <motion.div
            className="w-full flex gap-3 flex-wrap justify-center"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <form
              onSubmit={paymentFormik.handleSubmit}
              className="w-full h-full justify-center  space-y-4 flex  flex-wrap"
            >
              {loading ? (
                <div className="w-full flex justify-center py-6">
                  <Loader />
                </div>
              ) : error ? (
                <div className="w-full text-center text-red-600">{error}</div>
              ) : (
                methods.map((method) => {
                  const title =
                    lang && lang.startsWith("ar")
                      ? method.title_ar ?? method.title_en ?? method.title
                      : method.title_en ?? method.title ?? method.title_ar;
                  const banner =
                    lang && lang.startsWith("ar")
                      ? method.banner_ar ?? method.banner_en
                      : method.banner_en ?? method.banner_ar;
                  const value =
                    method.code ?? method.slug_en ?? String(method.id ?? title);
                  return (
                    <motion.label
                      key={method.id ?? value}
                      variants={item}
                      className={`w-6/12  flex justify-center`}
                    >
                      <input
                        name="payment"
                        type="radio"
                        className="radio-input my-10 py-10 "
                        value={value}
                        checked={paymentFormik.values.payment === value}
                        onChange={() => {
                          paymentFormik.setFieldValue("payment", value);
                          setPaymentMethod(method.id);
                        }}
                      />

                      <div className="radio-tile w-35 lg:w-50 h-40 lg:h-45  !flex flex-col justify-center  !items-center gap-4">
                        <div className="w-full justify-center  h-full  !flex !items-center gap-4 flex-col">
                          <span
                            className={`radio-icon flex flex-col justify-center items-center`}
                          >
                            {banner ? (
                              <img
                                src={banner}
                                alt={title}
                                className="h-15 lg:h-20 w-9/12 lg:w-10/12"
                              />
                            ) : (
                              fallbackIcon(method.code)
                            )}
                          </span>
                          <div>
                            <p>{title}</p>
                          </div>
                        </div>
                      </div>
                    </motion.label>
                  );
                })
              )}
              <div className="order-12 flex justify-center bg-third rounded-full">
                <OrderButton />
              </div>
            </form>
          </motion.div>
        </div>

        {/* <div className="w-full  px-5 flex gap-3 flex-wrap justify-center">
          {paymentMethods.map((method) => (
            <label
              className={` w-full   ${
                method.default ? "order-0" : "order-1"
              }`}
            >
              <input name="method" type="radio" className="radio-input" />
              <span className="radio-tile w-full h-20  !flex !items-center gap-4">
                <div className=" w-full h-20  !flex !items-center gap-4 ">
                  <span className="radio-icon">{method.icon}</span>
                  <div>
                    <p> {method.title}</p>
                  </div>
                </div>
                {method.default ? (
                  <div className="mx-3">
                    <h3>Default</h3>
                  </div>
                ) : null}
              </span>
            </label>
          ))}
        </div> */}
       {/* {isPaying ? 
        <div
          onClick={() => {
            setIsPaying(false);
          }}
          className="fixed inset-0 backdrop-blur-2xl"
        >
          <div
            onClick={(e) => {
              e.preventDefault();
            }}
            className="flex items-center justify-center"
          >
            <iframe
              src={`${paymentPage}`}
               
              className="bg-white w-250 h-250"
            ></iframe>
          </div>
        </div>:null

       } */}
      </div>
    </StyledWrapper>
  );
};
const StyledWrapper = styled.div`
  .radio-inputs {
    display: flex;
    flex-direction: column; /* Stack elements vertically */
    justify-content: center;
    align-items: center;
    max-width: 100%; /* Ensure it doesn't overflow */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .radio-inputs > * {
    margin: 10px 0; /* Add vertical spacing between options */
  }

  .radio-input:checked + .radio-tile {
    border-color: ${(props) => props.thirdColor};
    // box-shadow: 0 5px 10px rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 8px ${(props) => props.thirdColor},
      0 0 8px ${(props) => props.thirdColor} !important;
    color: ${(props) => props.thirdColor};
  }

  .radio-input:checked + .radio-tile:before {
    transform: scale(1);
    opacity: 1;
    background-color: ${(props) => props.thirdColor};
    border-color: ${(props) => props.thirdColor};
  }

  .radio-input:checked + .radio-tile .radio-icon svg {
    // fill: ${(props) => props.thirdColor};
  }

  .radio-input:checked + .radio-tile .radio-label {
    color: ${(props) => props.thirdColor};
  }

  .radio-input:focus + .radio-tile {
    border-color: ${(props) => props.thirdColor};
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1), 0 0 0 1px;
  }

  .radio-input:focus + .radio-tile:before {
    transform: scale(1);
    opacity: 1;
  }

  .radio-tile {
    display: flex;
    // flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    border-radius: 25px; /* Full pill shape */
    border: 2px solid #b5bfd9;
    background-color: #fff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    transition: 0.15s ease;
    cursor: pointer;
    position: relative;
    // padding-left: 50px; /* Space for the indicator */
  }

  .radio-tile:before {
    content: "";
    position: absolute;
    top: 10px;
    display: block;
    width: 20px; /* Size of the indicator */
    height: 20px; /* Size of the indicator */
    border: 2px solid #b5bfd9;
    background-color: #fff;
    border-radius: 50%; /* Circle shape for the indicator */
    left: 15px; /* Position of the indicator */
    transition: 0.25s ease;
  }

  .radio-tile:hover {
    border-color: ${(props) => props.thirdColor};
  }

  .radio-tile:hover:before {
    transform: scale(1);
    opacity: 1;
  }

  .radio-icon svg {
    // width: 1.5rem;
    // height: 1.5rem;
    // fill: bla;
  }

  .radio-label {
    color: #707070;
    transition: 0.375s ease;
    text-align: left; /* Align text to the left */
    font-size: 13px;
    margin-left: 10px; /* Space between the icon and label */
  }

  .radio-input {
    clip: rect(0 0 0 0);
    -webkit-clip-path: inset(100%);
    clip-path: inset(100%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;

export default PaymentMethods;
