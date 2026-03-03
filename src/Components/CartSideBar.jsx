import React, { useContext, useState } from "react";
import { FiX, FiTruck } from "react-icons/fi";
import { useCartUI } from "../context/useCartUI";

import { Link } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { deleteCartContext } from "../context/DeleteCartContext";
import empty from "../assets/Cart/empty.png";
import { Cart } from "../context/GetCartContext";
import { motion, AnimatePresence } from "framer-motion";

const CartSideBar = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { isCartOpen, closeCart } = useCartUI();
  const { deleteCart, clearCart, deleteBundleCart } =
    useContext(deleteCartContext);
  const [isClearCart, setIsClearCart] = useState(false);

  const { items, cart, bundles } = useContext(Cart);

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

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-lg z-100  "
          onClick={() => {
            closeCart();
            setIsClearCart(false);
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 flex flex-col h-full w-[380px] max-w-full bg-white shadow-2xl z-150 transform transition-transform duration-300 ease-in-out opacity-0 ${
          lang === "ar" ? "left-0" : "right-0"
        } ${
          isCartOpen
            ? "translate-x-0 opacity-100"
            : lang === "ar"
            ? "-translate-x-full"
            : "translate-x-full"
        }`}
      >
        {/* Clear Cart */}
        {isClearCart && (
          <div
            onClick={() => {
              setIsClearCart(false);
            }}
            className="fixed inset-0 h-full w-full flex items-center justify-center backdrop-blur-lg z-60"
          >
            <AnimatePresence>
              <motion.div
                key="clear-cart-modal"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.25 }}
                className="bg-primary w-full p-3 mx-3 flex flex-col gap-10 shadow-lg shadow-secondary text-third rounded-lg"
              >
                <p className="text-center font-bold my-4">{t("cart.Sure")}</p>

                <div className="w-full flex gap-3">
                  <button
                    onClick={() => {
                      setIsClearCart(false);
                    }}
                    className="w-full border-gray-500 mb-2 shadow-sm text-third bg-primary justify-center flex font-bold py-3 rounded-md"
                  >
                    {t("cart.No")}
                  </button>

                  <button
                    onClick={() => {
                      closeCart();
                      clearCart();
                      setIsClearCart(false);
                    }}
                    className="w-full border-gray-500 mb-2 shadow-sm text-white bg-red-700 justify-center flex font-bold py-3 rounded-md"
                  >
                    {t("cart.clearCart")}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-6 shadow-md">
          <h2 className="text-xl font-semibold">{t("cart.title")}</h2>
          <button
            onClick={closeCart}
            className="p-2 text-gray-600 hover:text-black"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Free shipping banner */}
        {items.length > 0 || bundles.length > 0 ? (
          <>
            <div className="px-4">
              <div className=" rounded-lg p-4 text-center text-sm">
                {t("cart.banner")}
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-2 bg-gray-200 rounded w-full">
                    <div className="h-2 bg-gray-800 rounded w-3/4" />
                  </div>
                  <FiTruck className="text-gray-700" size={22} />
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Items */}
        <div
          className={`no-scroll-bar px-4 space-y-6 overflow-y-scroll h-full ${
            items.length == 0 && bundles.length == 0 ? "flex items-center" : ""
          }`}
        >
          {items.length == 0 && bundles.length == 0 ? (
            <>
              <div className="w-full flex justify-center items-center flex-col pb-10 text-xl font-bold">
                <img
                  src={empty}
                  className="w-100 my-2"
                  alt={t("cart.emptyImageAlt")}
                />
                <h3>{t("cart.empty")}</h3>
              </div>
            </>
          ) : null}
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <img
                src={

                  item?.variant?
                  (lang === "en"
                    ? item?.variant?.banner_en
                    : item.variant.banner_ar ?? item.variant.banner_en )
                    :(lang === "en"? item.product.banner_en:item.product.banner_ar??item.product.banner_en)
                }
                alt={item.product.title_en}
                className="w-24 h-24 object-cover "
              />
              <div className="flex-1 items-center">
                <div className="flex justify-between ">
                  <div>
                    <div className="font-semibold text-sm  ">
                      {lang === "en"
                        ? item.product.title_en
                        : item.product.title_ar ?? item.product.title_en}
                      {item.variant? 
                        Object.entries(item?.variant?.variant).map(
                        ([optionName, optionValues]) => {
                          const isColor = optionName.toLowerCase() === "color";
                          const isArray = Array.isArray(optionValues);

                          return (
                            <div
                              key={optionName}
                              className={isColor ? "order-1" : "order-2"}
                            >
                              <div className="flex gap-4 flex-wrap">
                                {isArray ? (
                                  optionValues.map((item, index) => {
                                    const Key = Object.keys(item).find(
                                      (k) => k !== "value"
                                    );
                                    const value = Object.keys(item).find(
                                      (k) => k === "value"
                                    );

                                    const label = item[Key];
                                    const selected = item[value] == 1;
                                    const id = `${optionName}-${index}`;

                                    if (!selected) return null;

                                    return (
                                      <div key={id}>
                                        {isColor ? (
                                          <div className="flex items-center gap-3 w-full my-2">
                                            <span className="first-letter:uppercase">
                                              {optionName} :
                                            </span>
                                            <span
                                              className="inline-block w-5 h-5 rounded-full border"
                                              style={{ backgroundColor: label }}
                                            ></span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-3 w-full my-2">
                                            <span className="first-letter:uppercase">
                                              {optionName} :
                                            </span>
                                            <span className="font-bold">
                                              {label}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="flex items-center gap-3 w-full my-2">
                                    <span className="first-letter:uppercase">
                                      {optionName} :
                                    </span>

                                    {isColor ? (
                                      <span
                                        className="inline-block w-5 h-5 rounded-full border"
                                        style={{
                                          backgroundColor: optionValues,
                                        }}
                                      ></span>
                                    ) : (
                                      <span className="font-bold">
                                        {optionValues}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      ):null
                    
                    }
                    </div>

                    {(() => {
                      const result = calculateDiscount(item.variant);
                      const symbol =
                        lang === "en"
                          ? item.variant?.converted.symbol_en
                          : item.variant?.converted.symbol_ar ??
                            item.variant?.converted.symbol_en;

                      return (
                        <>
                          {result.hasDiscount && (
                            <div className="text-xs text-gray-500 line-through">
                              {symbol}
                              {item.variant?.converted?.converted_price}
                            </div>
                          )}
                          <div className="text-sm font-semibold">
                            {symbol} {result.price}
                          </div>
                          <div>x{item.quantity}</div>
                        </>
                      );
                    })()}
                  </div>
                  {item.is_free !== 2 ? (
                    <button
                      onClick={() => {
                        deleteCart(item.id);
                      }}
                      className="text-gray-400 hover:text-black"
                    >
                      <div className="bg-red-700 p-3 text-white w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer">
                        <FaRegTrashCan size={25} className="p-[1px]" />
                      </div>
                    </button>
                  ) : null}
                </div>
                {item.attributes > 0 && (
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    {item.attributes.map((attr) => (
                      <div key={attr.label}>
                        {attr.label}:{" "}
                        <span className="text-black">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* <div className="mt-3 inline-flex items-center border rounded">
                  <button className="px-3 py-1">-</button>
                  <span className="px-4 border-x">{item.qty}</span>
                  <button className="px-3 py-1">+</button>
                </div> */}
              </div>
            </div>
          ))}
          {bundles.map((item) => (
            <div key={item.id} className="flex gap-3">
              <img
                src={
                  lang === "en"
                    ? item.bundle_offer.banner_en
                    : item.bundle_offer.banner_ar ?? item.bundle_offer.banner_en
                }
                alt={item.bundle_offer.title_en}
                className="w-24 h-24 object-cover "
              />
              <div className="flex-1 items-center">
                <div className="flex justify-between ">
                  <div>
                    <p className="font-semibold text-sm">
                      {lang === "en"
                        ? item.bundle_offer.title_en
                        : item.bundle_offer.title_ar ??
                          item.bundle_offer.title_en}
                    </p>

                    <div className="text-sm font-semibold">
                      {lang === "en"
                        ? item.bundle_offer?.converted.symbol_en
                        : item.bundle_offer?.converted.symbol_ar ??
                          item.bundle_offer?.converted.symbol_en}{" "}
                      {item.bundle_offer.converted?.converted_balance}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      deleteBundleCart(item.bundle_offer.id);
                    }}
                    className="text-gray-400 hover:text-black"
                  >
                    <div className="bg-red-700 p-3 text-white w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer">
                      <FaRegTrashCan size={25} className="p-[1px]" />
                    </div>
                  </button>
                </div>
                {item.attributes > 0 && (
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    {item.attributes.map((attr) => (
                      <div key={attr.label}>
                        {attr.label}:{" "}
                        <span className="text-black">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* <div className="mt-3 inline-flex items-center border rounded">
                  <button className="px-3 py-1">-</button>
                  <span className="px-4 border-x">{item.qty}</span>
                  <button className="px-3 py-1">+</button>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="  bottom-0 left-0 right-0 border-t bg-white px-4 py-2 space-y-3">
          {items.length > 0 || bundles.length > 0 ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">{t("cart.shippingFees")}</span>
                <span className="font-bold flex items-center gap-2">
                  <div>
                    {lang === "en"
                      ? cart?.converted?.symbol_en
                      : cart?.converted?.symbol_ar ??
                        cart?.converted?.symbol_en}
                    {cart?.converted?.converted_price?.total_shipping || 0}
                  </div>
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">{t("cart.tax")}</span>
                <span className="font-bold flex items-center gap-2">
                  <div>
                    {lang === "en"
                      ? cart?.converted?.symbol_en
                      : cart?.converted?.symbol_ar ??
                        cart?.converted?.symbol_en}
                    {cart?.converted?.converted_price?.total_tax || 0}
                  </div>
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">{t("cart.totalInclVat")}</span>
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
              <Link
                onClick={closeCart}
                to="/checkout"
                className="w-full  border-gray-500     shadow-sm bg-gradient-to-b from-gray-300 justify-center flex  font-bold py-3 rounded-md "
              >
                {t("cart.checkOut")}
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  onClick={closeCart}
                  to="/cart"
                  className="w-full  border-gray-500 mb-4 shadow-sm bg-gradient-to-b from-gray-300 justify-center flex  font-bold py-3 rounded-md"
                >
                  {t("cart.viewCart")}
                </Link>
                <button
                  onClick={() => {
                    setIsClearCart(true);
                  }}
                  className="w-full  border-gray-500 mb-4 shadow-sm text-white  bg-red-700 justify-center flex  font-bold py-3 rounded-md"
                >
                  {t("cart.clearCart")}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </aside>
    </>
  );
};

export default CartSideBar;
