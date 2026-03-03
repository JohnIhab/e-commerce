import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaGreaterThan } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import empty from "../../assets/Cart/Empty.png";
// import iphone from "../../assets/profile/orders/iphone.png";
import OrderButton from "../../Components/OrderButton";
import CartButton from "../../Components/CartButton";
import { Helmet } from "react-helmet";
import { deleteCartContext } from "../../context/DeleteCartContext";
import { Cart as cartC } from "../../context/GetCartContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Cart = () => {
  const { i18n, t } = useTranslation();

  const lang = i18n.language;
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);

  function calculateDiscount(product) {
    const originalPrice = product?.converted?.converted_price;
    const discountType = product?.discount_type;
    const discountValue = product?.discount;
    const discountEnd = product?.discount_end_date
      ? new Date(product.discount_end_date)
      : null;

    const now = new Date();

    if (!discountType || discountValue == 0 || discountEnd < now) {
      return {
        price: originalPrice,
        hasDiscount: false,
      };
    }

    let discountedPrice = originalPrice;
    if (discountType === "fixed") {
      discountedPrice = originalPrice - discountValue;
    } else if (discountType === "percent") {
      discountedPrice = originalPrice - originalPrice * (discountValue / 100);
    }

    return {
      price: discountedPrice,
      hasDiscount: true,
    };
  }

  const { deleteCart, clearCart, deleteBundleCart } =
    useContext(deleteCartContext);

  const { items, cart, setChanged, bundles } = useContext(cartC);
  const quantityRef = useRef();
  const [quantity, setQuantity] = useState(0);

  async function quantityPlus(id, quantity) {
    const newQuantity = quantity + 1;

    try {
      const response = await axios.put(
        `${baseUrl}/carts/${id}`,
        { quantity: newQuantity },
        {
          headers: {
            "Content-Type": "application/json",

            "X-API-KEY": XApiKey,
            ...(localStorage.getItem("token")
              ? { Authorization: `${localStorage.getItem("token")}` }
              : localStorage.getItem("tempUserId")
              ? { "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}` }
              : {}),
          },
        }
      );
      toast.success(t("cart.quantityChangedSuccess"), {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "500",
        },
      });
      setChanged(Date.now);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
      } else if (error.request) {
        console.error("No Response:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    } finally {
     }
  }
  async function quantityMinus(id, quantity) {
    const newQuantity = quantity - 1;

    try {
      const response = await axios.put(
        `${baseUrl}/carts/${id}`,
        { quantity: newQuantity },
        {
          headers: {
            "Content-Type": "application/json",

            "X-API-KEY": XApiKey,
            ...(localStorage.getItem("token")
              ? { Authorization: `${localStorage.getItem("token")}` }
              : localStorage.getItem("tempUserId")
              ? { "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}` }
              : {}),
          },
        }
      );
      toast.success(t("cart.quantityChangedSuccess"), {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "500",
        },
      });
      setChanged(Date.now);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
      } else if (error.request) {
        console.error("No Response:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    } finally {
     }
  }
  return (
    <>
      <Helmet>
        <title>{t("cart.pageTitle")}</title>
        <meta name="description" content={t("cart.pageDescription")} />
      </Helmet>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-25">
        <div className="flex flex-col items-start justify-center w-full">
          <h2 className="text-3xl font-extrabold">
            {t("cart.title")}{" "}
            <span>{items.length > 0 ? <>({items.length})</> : null}</span>
          </h2>
          {/* <div className="flex gap-4 py-2 items-center">
            <div>
              <Link to="/">Home</Link>
            </div>
            <FaGreaterThan />
            <p>Cart</p>
          </div> */}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 justify-center w-full">
          {items.length > 0 ? (
            <>
              <div className="w-full lg:w-8/12">
                <div className="px-2 sm:px-4 rounded-lg">
                  <h3 className=" text-3xl font-bold mt-5 mb-5 flex items-center justify-center gap-2 border-b py-2 border-gray-500">
                    {t("cart.yourItems")}
                  </h3>
                  <table className="w-full w-primary  ">
                    <thead  >
                      <tr className="bg-secondary/20">
                        <th className={` p-2  text-start `}>Product</th>
                        <th className="  text-center">Price</th>
                        <th className="  text-center">Tax</th>
                        <th className="  text-center">Total</th>
                        <th className="  text-center">Quantity</th>
                        <th className={` p-2  text-end `}>Delete</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((item) => {
                        const result = calculateDiscount(item.product);
                        const symbol =
                          lang === "en"
                            ? item.product?.converted.symbol_en
                            : item.product?.converted.symbol_ar ??
                              item.product?.converted.symbol_en;

                        return (
                          <tr
                            key={item.id}
                            className={`  even:bg-secondary/15 odd:bg-secondary/10  `} 
                          >
                            {/* Product Info */}
                            <td className="p-3">
                              <div className="flex items-center flex-col lg:flex-row gap-3">
                                <img
                                  src={
                                    lang === "en"
                                      ? item.product.banner_en
                                      : item.product.banner_ar ??
                                        item.product.banner_en
                                  }
                                  className="w-20 h-20 object-contain rounded"
                                  alt=""
                                />
                                <div className="flex flex-col">
                                  <h3
                                    title={
                                      lang === "en"
                                        ? item?.product?.title_en
                                        : item?.product.title_ar ??
                                          item.product.title_en
                                    }
                                    className="font-bold text-sm sm:text-base truncate w-[120px] sm:w-[200px]"
                                  >
                                    {lang === "en"
                                      ? item.product.title_en : item.product.title_ar
                                      ?? item.product.title_en
                                    }
                                  </h3>
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td className=" p-1 text-sm sm:text-base">
                              {result.hasDiscount && (
                                <div className="text-third/70 line-through text-xs">
                                  {symbol}
                                  {item.product?.converted?.converted_price}
                                </div>
                              )}
                              <div className="font-semibold">
                                {symbol} {result.price}
                              </div>
                            </td>

                            {/* Tax */}
                            <td className=" p-1 text-sm sm:text-base">
                             
                              <div className="font-semibold">
                                {symbol} {item?.converted?.converted_price.tax}
                              </div>
                            </td>
                             {/* Total */}
                            <td className=" p-1 text-sm sm:text-base">
                              {result.hasDiscount && (
                                <div className="text-third/70 line-through text-xs">
                                  {symbol}
                                  {item.product?.converted?.converted_price}
                                </div>
                              )}
                              <div className="font-semibold">
                                {symbol} {result.price * item.quantity}
                              </div>
                            </td>

                            {/* Quantity */}
                            <td className=" ">
                              {item.is_free === 0 ? (
                                <div className="flex items-center flex-col lg:flex-row gap-3">
                                  <button
                                    onClick={() =>
                                      quantityMinus(item.id, item.quantity)
                                    }
                                    disabled={item.quantity === 1}
                                    className="bg-third p-2 text-primary hover:text-third hover:bg-primary duration-500 border-primary hover:border-third border-2 w-8 h-8 rounded-full flex items-center justify-center"
                                  >
                                    <FaMinus size={14} />
                                  </button>

                                  <p className="text-xl font-bold">
                                    {item.quantity}
                                  </p>

                                  <button
                                    onClick={() =>
                                      quantityPlus(item.id, item.quantity)
                                    }
                                    className="bg-third p-2 text-primary hover:text-third hover:bg-primary duration-500 border-primary hover:border-third border-2 w-8 h-8 rounded-full flex items-center justify-center"
                                  >
                                    <FaPlus size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-green-600 font-bold">
                                  FREE
                                </span>
                              )}
                            </td>
                           

                            {/* Actions */}
                            <td className=" p-1 ">
                              {item.is_free === 0 ? (
                                <div
                                  onClick={() => deleteCart(item.id)}
                                  className="mx-auto bg-red-700 hover:bg-red-500 duration-300 p-2 text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                                >
                                  <FaRegTrashCan size={14} />
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {bundles?.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-10 p-2 rounded-lg my-3 shadow-lg even:shadow-secondary  odd:shadow-third"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] flex items-center mx-2">
                          <img
                            src={
                              lang === "en"
                                ? item.bundle_offer.banner_en
                                : item.bundle_offer.banner_ar ??
                                  item.bundle_offer.banner_en
                            }
                            className="m-2 w-full h-full object-contain"
                            alt=""
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h3
                            title={
                              lang === "en"
                                ? item?.product?.title_en
                                : item?.product?.title_ar ??
                                  item?.product?.title_en
                            }
                            className="font-bold text-base sm:text-lg md:text-xl truncate"
                          >
                            {lang === "en"
                              ? item?.bundle_offer?.title_en : item?.bundle_offer?.title_ar
                              ?? item?.bundle_offer?.title_en
                            }
                          </h3>
                          <div className="text-sm sm:text-base md:text-lg">
                            {(() => {
                              const result = calculateDiscount(
                                item.bundle_offer
                              );
                              const symbol =
                                lang === "en"
                                  ? item.bundle_offer?.converted.symbol_en
                                  : item.bundle_offer?.converted.symbol_ar ??
                                    item.bundle_offer?.converted.symbol_en;

                              return (
                                <>
                                  {result.hasDiscount && (
                                    <div className="text-xs text-gray-500 line-through">
                                      {symbol}
                                      {
                                        item.bundle_offer?.converted
                                          ?.converted_price
                                      }
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                            <div className="text-sm font-semibold">
                              {lang === "en"
                                ? item.bundle_offer?.converted.symbol_en
                                : item.bundle_offer?.converted.symbol_ar ??
                                  item.bundle_offer?.converted.symbol_en}{" "}
                              {item.bundle_offer.converted?.converted_balance}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex flex-col items-end gap-5 my-2">
                        <div className="flex items-center gap-5">
                          <button
                            onClick={() => {
                              quantityMinus(item.id, item.quantity);
                            }}
                            disabled={quantity == 1}
                            className="bg-[#3c5353]  p-3 text-white w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer"
                          >
                            <FaMinus size={25} style={{ padding: 1 }} />
                          </button>

                          <p ref={quantityRef} className="text-3xl font-bold">
                            {item.quantity}
                          </p>

                          <button
                            onClick={() => {
                              quantityPlus(item.id, item.quantity);
                            }}
                            className="bg-[#3c5353]  p-3 text-white w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer"
                          >
                            <FaPlus size={25} style={{ padding: 1 }} />
                          </button>
                        </div>
                        
                        */}
                      <div
                        onClick={() => {
                          deleteBundleCart(item.bundle_offer.id);
                        }}
                        className="bg-red-700 border-1 border-primary hover:bg-red-500 hover:border-third duration-500 p-2 sm:p-3 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer"
                      >
                        <FaRegTrashCan size={22} style={{ padding: 1 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 sm:p-5 flex flex-col items-end">
                  {/* <div className="lg:w-4/12 w-8/12 flex items-end   justify-between gap-4 text-sm">
                    <span className="font-bold text-start">
                      {t("cart.shippingFees")}
                    </span>
                    <span className="font-bold flex items-center gap-2">
                      <div>
                        {lang === "en"
                          ? cart?.converted?.symbol_en
                          : cart?.converted?.symbol_ar ??
                            cart?.converted?.symbol_en}
                        {cart?.converted?.converted_price?.total_shipping || 0}
                      </div>
                    </span>
                  </div> */}
                  {/* <div className="lg:w-4/12 w-8/12 flex items-end   justify-between gap-4 text-sm">
                    <span className="font-bold text-start">
                      {t("cart.tax")}
                    </span>
                    <span className="font-bold flex items-center gap-2">
                      <div>
                        {lang === "en"
                          ? cart?.converted?.symbol_en
                          : cart?.converted?.symbol_ar ??
                            cart?.converted?.symbol_en}
                        {cart?.converted?.converted_price?.total_tax || 0}
                      </div>
                    </span>
                  </div> */}
                  <div className="lg:w-4/12 w-8/12   flex items-end   justify-between gap-4 text-sm">
                    <span className="font-bold text-start">
                      {t("cart.totalInclVat")}
                    </span>
                    <span className="font-bold flex items-center gap-2">
                      {cart?.converted?.converted_price?.total_discount > 0 ? (
                        <>
                          <div className="text-xs text-gray-500 line-through">
                            {lang === "en"
                              ? cart?.converted?.symbol_en
                              : cart?.converted?.symbol_ar ??
                                cart?.converted?.symbol_en}
                            {cart?.converted?.converted_price?.total_price || 0}
                          </div>
                          <div>
                            {lang === "en"
                              ? cart?.converted?.symbol_en
                              : cart?.converted?.symbol_ar ??
                                cart?.converted?.symbol_en}
                            {cart?.converted?.converted_price
                              ?.total_price_after_discount || 0}
                          </div>
                        </>
                      ) : (
                        <div>
                          {lang === "en"
                            ? cart?.converted?.symbol_en
                            : cart?.converted?.symbol_ar ??
                              cart?.converted?.symbol_en}
                          {cart?.converted?.converted_price?.total_price || 0}
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
        {items.length == 0 ? (
          <>
            <div className="w-full flex justify-center items-center gap-3 sm:gap-5 flex-col pb-10 text-lg sm:text-xl font-bold">
              <img src={empty} className="w-40 sm:w-60 my-2" alt="" />
              <h3>{t("cart.empty")}</h3>

              <div>
                <Link
                  to="/shop"
                  className="bg-third text-primary border-third border rounded-lg hover:bg-primary hover:text-third font-bold text-lg sm:text-2xl my-3 px-3 py-1 duration-500"
                >
                  {t("cart.shopNow")}
                </Link>
              </div>
            </div>
          </>
        ) : null}

        {items.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-3 mt-4">
              <div className="flex w-full sm:w-4/12 justify-center">
                <CartButton />
              </div>
              <button
                onClick={() => {
                  clearCart();
                }}
                className="w-full sm:w-2/12 border-gray-500 my-4 shadow-sm text-white bg-red-700 justify-center flex font-bold py-4 rounded-md"
              >
                {t("cart.clearCart")}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Cart;
