import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import test from "../../assets/Shop/first-aid-kit-schedule-list-vector-cartoon-character_193274-15797.jpg";
import { RiDiscountPercentFill } from "react-icons/ri";
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { MdCompareArrows } from "react-icons/md";
import { useCompare } from "../../context/CompareContext";
import { useTranslation } from "react-i18next";
import { addToWishListContext } from "../../context/AddToWishListContext";
import { Wishlist } from "../../context/GetWishList";
import { addToCartContext } from "../../context/AddToCartContext";
import { Cart } from "../../context/GetCartContext";
import { useCartUI } from "../../context/useCartUI";
import AddLoader from "../AddLoader";
import { CurrencyContext } from "../../context/Currency";
import { LuRefreshCcw } from "react-icons/lu";
import toast from "react-hot-toast";
const ProductCard = ({ product }) => {
  const { addToWishlist } = useContext(addToWishListContext);
  const { setChanged } = useContext(Wishlist);
  const { addToCart, showModal, setShowModal, setModalSlug } = useContext(addToCartContext);
  const { setChanged: setCartChanged } = useContext(Cart);
  const { openCart } = useCartUI();
  const { currencyAr, currencyEn } = useContext(CurrencyContext);

  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const [discountData, setDiscountData] = useState({
    price: 0,
    hasDiscount: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const {
    compareList = [],
    addToCompare,
    removeFromCompare,
    setComparechanged,
  } = useCompare();

  function calculateDiscount(product) {
    const originalPrice = product?.converted?.converted_price;
    const discountType = product?.discount_type;
    const discountValue = product?.discount;
    const discountEnd = product?.discount_end_date
      ? new Date(product.discount_end_date)
      : null;

    const now = new Date();

    if (
      !discountType ||
      discountValue == 0 ||
      (discountEnd && discountEnd < now)
    ) {
      return { price: originalPrice, hasDiscount: false };
    }

    let discountedPrice = originalPrice;
    if (discountType === "fixed") {
      discountedPrice = originalPrice - discountValue;
    } else if (discountType === "percent") {
      discountedPrice = originalPrice - originalPrice * (discountValue / 100);
    }

    return { price: discountedPrice, hasDiscount: true };
  }

  useEffect(() => {
    if (product) {
      const result = calculateDiscount(product);
      setDiscountData(result);
    }
  }, [product]);

  const img =
    (lang === "en"
      ? product?.banner_en
      : product?.banner_ar ?? product?.banner_en) || test;

  const name =
    (lang === "en"
      ? product?.title_en
      : product?.title_ar ?? product?.title_en) || "Product";
  const categoryName =
    lang === "en"
      ? product?.category?.title_en
      : product?.category?.title_ar ?? product?.category?.title_en;

  const id = product?.id || "";
  const detailsHref = `/details/${product?.slug_en ?? ""}`;

  const handleAddToWishlist = async () => {
    try {
      setIsLoading(true);
      await addToWishlist(id);
      setChanged(id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden w-full min-h-full">
      <div className="relative bg-gray-50">
        <Link to={detailsHref}>
          <div className="w-full aspect-[4/4] overflow-hidden h-full">
            <img
              src={img}
              alt={name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {discountData.hasDiscount && (
          <div
            className={`absolute top-2 ${
              lang === "ar" ? "right-2" : "left-2"
            } flex items-center gap-1 rounded-full bg-rose-600/80 text-white px-2 py-1 text-xs font-semibold`}
          >
            <span>{t("featured-flash.Sale")}</span>
            <RiDiscountPercentFill size={14} />
          </div>
        )}

        {categoryName && (
          <div className="absolute bottom-0 left-0 right-0 w-full bg-third/60 backdrop-blur-sm px-3 py-2 text-center">
            <span className="text-md font-semibold text-white">
              {categoryName}
            </span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-center gap-3 flex-col absolute z-5 top-1 end-2">
          <button
            onClick={async () => {
              try {
                setIsAddingToCart(true);
                // await addToCart(product.id);
                setShowModal(true)
                setModalSlug(product?.slug_en)
                // setCartChanged(product.id);
                // openCart();
              } finally {
                setIsAddingToCart(false);
              }
            }}
            type="button"
            className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 backdrop-blur-lg hover:text-third text-primary bg-third hover:bg-gray-50 transition"
            aria-label="Add to cart"
          >
            {isAddingToCart ? <AddLoader /> : <FaCartShopping size={18} />}
          </button>

          {isLoading ? (
            <div className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 backdrop-blur-lg text-primary bg-third">
              <AddLoader />
            </div>
          ) : (
            <button
              onClick={handleAddToWishlist}
              type="button"
              className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 backdrop-blur-lg hover:text-third text-primary bg-third hover:bg-gray-50 transition"
              aria-label="Add to wishlist"
            >
              <FaRegHeart size={18} />
            </button>
          )}

          <button
            type="button"
            onClick={async () => {
              const existing = compareList.find(
                (item) => item.product?.id === product.id
              );
              try {
                setIsComparing(true);
               if (existing) {
                  // await removeFromCompare(existing.id);
                  toast.error(t("compare.alreadyexist"))
                } else {
                  await addToCompare(product.id);
                  setComparechanged(Date.now());
                }
              } catch (err) {
                // error handled by context toasts
                console.error(err);
              } finally {
                setIsComparing(false);
              }
            }}
            className={`h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 backdrop-blur-lg hover:text-third text-primary bg-third hover:bg-gray-50 transition ${
              compareList.find((item) => item.product?.id === product.id)
                ? "bg-primary text-white"
                : ""
            }`}
            aria-label="Compare"
          >
            {isComparing ? <AddLoader /> : <LuRefreshCcw size={18} />}
          </button>
        </div>
      </div>

      <div className="p-4 text-start">
        <Link to={detailsHref} className="text-center">
          <h3
            title={name}
            className="truncate text-sm md:text-base font-bold line-clamp-2 min-h-[3rem] text-slate-900"
          >
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-center" dir="ltr">
          {discountData.hasDiscount && (
            <span className="text-sm text-slate-400 line-through">
              {lang === "en"
                ? product?.converted.symbol_en
                : product?.converted.symbol_ar ?? product?.converted.symbol_en}
              {product?.converted.converted_price}
            </span>
          )}

          <span className="text-base md:text-lg font-bold mx-2">
            {lang === "en"
              ? product?.converted.symbol_en
              : product?.converted.symbol_ar ?? product?.converted.symbol_en}
            {discountData.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
