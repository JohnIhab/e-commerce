import React, { useMemo, useState, useRef, useEffect, useContext } from "react";
import { FiHeart, FiRefreshCcw, FiMinus, FiPlus } from "react-icons/fi";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ApiAuthContext } from "../../context/AuthContext";
import axios from "axios";
import fallbackImg from "../../assets/Shop/first-aid-kit-schedule-list-vector-cartoon-character_193274-15797.jpg";
import Loader from "../../Components/Loader";
import { addToWishListContext } from "../../context/AddToWishListContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import { GrOverview } from "react-icons/gr";
import { TbListDetails } from "react-icons/tb";
import he from "he";
import { Wishlist } from "../../context/GetWishList";
import { Helmet } from "react-helmet";
import { SettingsContext } from "../../context/Settings";
import { addToCartContext } from "../../context/AddToCartContext";
import { useCartUI } from "./../../context/useCartUI";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useCompare } from "../../context/CompareContext";
import { FaCircleCheck, FaTags } from "react-icons/fa6";
import { BsInfoCircleFill } from "react-icons/bs";

import { MdNotificationsActive, MdOutlineDescription } from "react-icons/md";
import { motion } from "framer-motion";

const ProductDetails = ({ modal = false, modalSlug = null }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const params = useParams();
  const [slug, setSlug] = useState(null);
  const AnimatedSections = ({ children }) => {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        {React.Children.map(children, (child, index) => (
          <motion.div variants={itemVariants} key={index}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  };

  useEffect(() => {
    if (modal) {
      setSlug(modalSlug);
    } else {
      setSlug(params?.slug);
    }
  }, [modal, modalSlug, params]);
  const { addToCart } = useContext(addToCartContext);
  const navigate = useNavigate();
  const quantityRef = useRef();
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { addToWishlist } = useContext(addToWishListContext);
  const [discountPrice, setDiscoundPrice] = useState();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { setChanged } = useContext(Wishlist);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(true);
  const [details, setDetails] = useState(false);
  const [error, setError] = useState("");
  const { openCart } = useCartUI();
  const { siteName_ar, siteName_en } = useContext(SettingsContext);
  const [isComparing, setIsComparing] = useState(false);
  function DecodedText({ text }) {
    const safeText = typeof text === "string" ? text : "";
    const decodedHtml = he.decode(safeText);
    return <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />;
  }

  const {
    compareList = [],
    addToCompare,
    removeFromCompare,
    setComparechanged,
  } = useCompare();

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${baseUrl}/products/${slug}`, {
          headers: { "X-API-KEY": XApiKey },
        });
        if (!isMounted) return;

        let payload = data?.data.product ?? data?.product ?? data;
        if (Array.isArray(payload)) payload = payload[0];
        setProduct(payload);
        setRelatedProducts(data.data.related_products);
      } catch {
        if (!isMounted) return;
        setError(t("product-details.errorLoad"));
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    setQty(1);
    load();
    return () => {
      isMounted = false;
    };
  }, [baseUrl, slug]);

  const struck = product?.converted.converted_price || "";

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

  useEffect(() => {
    if (product) {
      const { price, hasDiscount } = calculateDiscount(product);
      setDiscoundPrice(price);
    }
  }, [product]);

  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    if (!product) return;

    console.log(product);

    const finalGallery =
      product?.chosen_options.available[0]?.photos ?? product.photos;

    setGallery(finalGallery);
  }, [product]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const hasDiscount = Boolean(product?.discount > 0);
  const mainPrice = product?.converted.converted_price || "";
  const imageWrapRef = useRef(null);
  const [isZooming, setIsZooming] = useState(false);
  const [lensStyle, setLensStyle] = useState({
    left: 0,
    top: 0,
    bgPos: "50% 50%",
  });
  const LENS_SIZE = 200;
  const ZOOM = 5;

  const handleMouseMove = (e) => {
    if (!imageWrapRef.current) return;
    const rect = imageWrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const half = LENS_SIZE / 2;
    const clampedX = Math.max(half, Math.min(rect.width - half, x));
    const clampedY = Math.max(half, Math.min(rect.height - half, y));
    const bgX = ((clampedX / rect.width) * 100).toFixed(2);
    const bgY = ((clampedY / rect.height) * 100).toFixed(2);
    setLensStyle({
      left: clampedX - half,
      top: clampedY - half,
      bgPos: `${bgX}% ${bgY}%`,
    });
  };
  const [selectedOptions, setSelectedOptions] = useState({});
  async function fetchProductWithOptions({ options }) {
    console.log({
      product_id: product.id,
      options,
    });

    const { data } = await axios.get(`${baseUrl}/products/variant-by-options`, {
      params: {
        product_id: product.id,
        options,
      },
      headers: { "X-API-KEY": XApiKey },
    });
    console.log(data.data.product);
    console.log(data.data.related_products);
    setProduct(data.data.product);
    setGallery(
      data.data.product.chosen_options.available[0].photos ??
        data.data.product.photos
    );

    return data;
  }

  const useProductOptions = (product_id, options) => {
    return useQuery({
      queryKey: ["product", product_id, options],
      queryFn: () => fetchProductWithOptions({ product_id, options }),
      enabled: !!product_id && Object.keys(options).length > 0,
    });
  };

  // query
  const {
    data,
    isLoading,
    error: VarientError,
  } = useProductOptions(product?.id, selectedOptions);

  const handleOptionChange = (optionName, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  return (
    <>
      <Helmet key={[lang, product]}>
        <title>
          {lang === "en"
            ? `${siteName_en} | ${product?.title_en}`
            : `${siteName_ar} | ${product?.title_ar || product?.title_en}`}
        </title>

        {/* Markup for Google */}
        <meta
          itemProp="name"
          content={
            lang == "en"
              ? product?.meta_title_en
              : product?.meta_title_ar ?? product?.meta_title_en
          }
        />
        <meta
          itemProp="description"
          content={
            lang == "en"
              ? product?.meta_description_en
              : product?.meta_description_ar ?? product?.meta_description_en
          }
        />
        <meta itemProp="image" content={product?.meta_img} />

        {/*  Twitter Card data*/}
        <meta name="twitter:card" content="product" />
        {/* <meta name="twitter:site" content="@publisher_handle"/> */}
        {/* <meta name="twitter:creator" content="@author_handle"/> */}
        <meta
          name="twitter:title"
          content={
            lang == "en"
              ? product?.meta_title_en
              : product?.meta_title_ar ?? product?.meta_title_en
          }
        />
        <meta
          name="twitter:description"
          content={
            lang == "en"
              ? product?.meta_description_en
              : product?.meta_description_ar ?? product?.meta_description_en
          }
        />
        <meta name="twitter:image" content={product?.meta_img} />
        <meta
          name="twitter:data1"
          content={product?.converted.converted_price}
        />
        <meta name="twitter:label1" content="Price"></meta>

        {/* Open Graph data  */}

        <meta property="og:id" content={product?.id} />
        <meta
          property="og:title"
          content={
            lang == "en"
              ? product?.meta_title_en
              : product?.meta_title_ar ?? product?.meta_title_en
          }
        />
        <meta
          property="og:description"
          content={
            lang == "en"
              ? product?.meta_description_en
              : product?.meta_description_ar ?? product?.meta_description_en
          }
        />
        <meta
          property="og:url"
          content={`/details/${
            lang == "en"
              ? product?.slug_en
              : product?.slug_ar ?? product?.slug_en
          }`}
        />
        <meta property="og:image" content={product?.meta_img} />
        <meta property="og:type" content="og:product" />
        {product?.brand ? (
          <meta
            property="product:brand"
            content={
              lang == "en"
                ? product?.brand.title_en
                : product?.brand.title_ar ?? product?.brand.title_en
            }
          />
        ) : null}
        <meta property="product:availability" content="in stock" />
        <meta property="product:condition" content="new" />
        <meta
          property="og:site_name"
          content={lang === "en" ? `${siteName_en}` : `${siteName_ar}`}
        />
        <meta
          property="product:price:amount"
          content={product?.converted.converted_price}
        />
        <meta
          property="product:price:currency"
          content={product?.converted.currency_code}
        />
        <meta property="product:retailer_item_id" content={product?.id} />
        <meta property="product:item_group_id" content={product?.id}></meta>
      </Helmet>

      <div
        className={`max-w-8xl mx-auto  bg-gradient-to-b from-[#e9e9e99e] via-primary to-primary ${
          modal ? "py-8" : "pt-30"
        }`}
      >
        {loading ? (
          <div className="h-screen flex justify-center items-center relative -top-30  ">
            <Loader />
          </div>
        ) : error ? (
          <div className="py-24 text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 px-4 md:px-10  ">
            {/* ---------- Images ---------- */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-5">
              <Swiper
                key={[lang, gallery]}
                slidesPerView={3.5}
                spaceBetween={7}
                className="order-2 w-full  "
              >
                {gallery.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <button
                      onClick={() => setActiveIdx(idx)}
                      className={`rounded-2xl overflow-hidden m-2 w-25 md:w-40 h-25 md:h-40  transition-all duration-300 bg-white ${
                        activeIdx === idx
                          ? "ring-1 ring-secondary shadow-md shadow-secondary"
                          : "  opacity-50"
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumb"
                        className="w-full h-full  object-cover object-top"
                        onError={(e) => (e.currentTarget.src = fallbackImg)}
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div
                ref={imageWrapRef}
                className="relative max-h-[550px]  shadow-sm rounded-3xl  overflow-hidden bg-white flex items-center justify-center"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={gallery[activeIdx]}
                  alt={product?.name || "product"}
                  className="w-full h-full object-contain"
                  // style={{ maxHeight: 350 }}
                  onError={(e) => (e.currentTarget.src = fallbackImg)}
                />

                {isZooming && (
                  <div
                    className="pointer-events-none absolute rounded-full ring-2 ring-white/70 shadow-xl hidden md:block"
                    style={{
                      width: LENS_SIZE,
                      height: LENS_SIZE,
                      left: lensStyle.left,
                      top: lensStyle.top,
                      backgroundImage: `url(${gallery[activeIdx]})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${ZOOM * 100}% auto`,
                      backgroundPosition: lensStyle.bgPos,
                    }}
                  />
                )}
              </div>
            </div>

            {/* ---------- Info ---------- */}
            <div className="flex flex-col gap-5 !h-full justify-start">
              <div className="flex flex-col justify-center  gap-3">
                {product?.current_stock > 0 ? (
                  // <span className="  w-28 justify-center inline-flex items-center text-xs   px-2 py-1 rounded-full border border-green-600 text-green-700">
                  //   <FaCircleCheck />

                  //   {t("product-details.inStock")}
                  // </span>
                  <div className="flex items-center w-fit    ">
                    <div className="px-2.5 py-1 rounded-full bg-green-100 ring-red-600 ring-1     text-green-600  text-xs font-bold uppercase  flex items-center gap-1.5">
                      <FaCircleCheck />
                      {t("product-details.inStock")}
                    </div>
                  </div>
                ) : (
                  // <span className="   w-30 justify-center  inline-flex items-center text-xs   px-2 py-1 rounded-full border border-red-600 text-red-700">
                  //   {t("product-details.outStock")}
                  // </span>
                  <div className="flex items-center w-fit bg-primary  rounded-full border border-secondary/20  p-1 pe-4 gap-3  ">
                    <div className="px-2.5 py-1 rounded-full bg-red-100 ring-red-500 ring-1      text-red-600  text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                      <BsInfoCircleFill />
                      {t("product-details.outStock")}
                    </div>
                    <a
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-400   hover:text-third transition-colors group"
                      href="#notify-section"
                    >
                      <span
                        className="material-symbols-outlined text-gray-400 dark:text-slate-500 group-hover:text-third transition-colors"
                        style={{ fontSize: 16 }}
                      >
                        <MdNotificationsActive />
                      </span>
                      {t("product-details.notifyMe")}
                    </a>
                  </div>
                )}
                <h1 className="  md:text-3xl font-bold text-base">
                  {/* {lang === "en"
                    ? product.title_en
                    : product.title_ar ?? product.title_en} */}

                  {product[`title_${lang}`] ?? product.title_en}
                </h1>
              </div>

              {/* <div className="text-xl md:text-2xl font-semibold mb-4">
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    {lang === "en"
                      ? product?.converted.symbol_en
                      : product?.converted.symbol_ar ??
                        product?.converted.symbol_en}
                    {struck}
                  </span>
                )}
                <span className="text-base md:text-lg font-bold mx-2">
                  {lang === "en"
                    ? product?.converted.symbol_en
                    : product?.converted.symbol_ar ??
                      product?.converted.symbol_en}
                  {mainPrice}
                </span>
              </div> */}
              {/* <div className="text-xl md:text-2xl font-semibold mb-4">
                {calculateDiscount(product)?.hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    {lang === "en"
                      ? product?.converted.symbol_en
                      : product?.converted.symbol_ar ??
                        product?.converted.symbol_en}
                    {product?.converted.converted_price}
                  </span>
                )}
                <span className="text-base md:text-lg font-bold mx-2">
                  {lang === "en"
                    ? product?.converted.symbol_en
                    : product?.converted.symbol_ar ??
                      product?.converted.symbol_en}
                  {calculateDiscount(product)?.price}
                </span>
              </div> */}

              {/* Category */}
              {/* {product?.category ? 
            
             <div className="flex gap-3 items-center ">
              <div>Category:</div>
               <div className="w-fit ">
                <p className="border border-secondary text-secondary text-center  p-3 rounded-lg">
                  {product?.category[`title_${lang}`] ?? product?.title_en}
                </p>
              </div>
             </div>:null

            } */}

              {/* Price */}
              <div className="flex items-center  gap-3     ">
                {/* <div className="text-xl text-third">
                  {t("product-details.price")}:
                </div> */}
                <div className="text-lg font-semibold">
                  <div className="flex items-center justify-center bg-primary p-2 rounded-lg  ">
                    {calculateDiscount(product)?.hasDiscount && (
                      <span className="text-md text-slate-400 line-through ">
                        {lang === "en"
                          ? product?.converted.symbol_en
                          : product?.converted.symbol_ar ??
                            product?.converted.symbol_en}
                        {product?.converted.converted_price}
                      </span>
                    )}
                    <span className="text-lg md:text-3xl   mx-2 ">
                      {lang === "en"
                        ? product?.converted.symbol_en
                        : product?.converted.symbol_ar ??
                          product?.converted.symbol_en}
                      {calculateDiscount(product)?.price}
                    </span>
                  </div>
                </div>
              </div>
              {/* Category */}
              {product?.category ? (
                <div className="flex justify-between items-center   transition-all duration-500 shadow-md hover:shadow-third/50 bg-primary/50 py-3 px-5 rounded-xl">
                  <div className="flex gap-3 items-center ">
                    <div className="bg-third/20 flex items-center justify-center rounded-full h-[50px] w-[50px]">
                      <img
                        src={
                          product.category[`banner_${lang}`] ??
                          product.category.banner_en
                        }
                        className="h-[45px] w-[45px] rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-third/40 font-bold">
                        {t("product-details.category")}
                      </div>

                      <p className=" text-2xl font-bold">
                        {product?.category[`title_${lang}`] ??
                          product?.title_en}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer">
                    <div className="bg-third/20 h-[25px] w-[1px]"></div>
                    <Link to={`/categories/${product?.category[`title_${lang}`] ?? product?.title_en}`}>
                      {t("product-details.viewAllFrom")}{" "}
                      {product?.category[`title_${lang}`] ?? product?.title_en}
                    </Link>
                  </div>
                </div>
              ) : null}

              {/* Description */}
              <div className="flex flex-col gap-5 p-4 shadow-md  rounded-xl bg-primary/50">
                <div className="flex gap-3 items-center">
                  <div className="p-3 rounded-full shadow-md">
                    <MdOutlineDescription size={25} />
                  </div>
                  <p className="font-bold">
                    {t("product-details.description")}
                  </p>
                </div>
                <DecodedText
                  text={
                    lang === "en"
                      ? product.short_description_en
                      : product.short_description_ar ??
                        product.short_description_en
                  }
                />
              </div>

              {/* Points */}
              {product.earn_point > 0 && (
                <div className="flex  items-start gap-3 bg-secondary/5 border-secondary/50 border w-full p-4   rounded-xl shadow-sm">
                  <div className="p-3 bg-secondary/25 rounded-full">
                    <FaTags />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xl text-third font-bold">
                      {t("product-details.rewards", { site: lang === "en"?siteName_en:siteName_ar })}
                    </p>

                    <p>
                      {t("product-details.earnPoints", {
                        points: product.earn_point,
                      })}
                    </p>

                   {!localStorage.getItem("token")?
                    <Link to="/login" className="font-bold">
                      {t("product-details.loginToRedeem")}
                    </Link>:null

                   }
                  </div>
                  {/* <div className=" p-2 min-w-[60px] flex justify-center items-center   text-secondary rounded xl"> */}
                  {/* </div> */}
                </div>
              )}

              {/* Varients */}
              <form className="flex flex-col">
                {Object.entries(product.chosen_options.options).map(
                  ([optionName, optionValues]) => {
                    const isColor = optionName.toLowerCase() === "color";

                    return (
                      <div
                        key={optionName}
                        className={`mb-4 ${isColor ? "order-1" : "order-2"}`}
                      >
                        <h3 className="font-semibold mb-2">{optionName}</h3>

                        <div className="flex gap-4 flex-wrap">
                          {optionValues.map((item, index) => {
                            const Key = Object.keys(item).find(
                              (Key) => Key !== "value"
                            );
                            const label = item[Key];
                            const id = `${optionName}-${index}`;

                            return (
                              <label
                                key={id}
                                htmlFor={id}
                                className="cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  id={id}
                                  name={optionName}
                                  value={label}
                                  checked={item.value === 1}
                                  onChange={() =>
                                    handleOptionChange(optionName, label)
                                  }
                                  className="hidden peer"
                                />

                                {isColor ? (
                                  <span
                                    className="block w-10 h-10 rounded-full border peer-checked:ring-3 peer-checked:ring-secondary"
                                    style={{ backgroundColor: label }}
                                  ></span>
                                ) : (
                                  <span className=" px-4 py-2 border rounded-lg block font-bold peer-checked:bg-secondary  peer-checked:text-primary  peer-checked:shadow-md  peer-checked:shadow-secondary">
                                    {label}
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </form>

              {/* ---------- Buttons ---------- */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-md bg-gray-100 px-2">
                  <button
                    className="px-3 py-3 hover:bg-third hover:border-secondary hover:text-primary rounded-tl-lg rounded-br-lg duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={product?.current_stock <= 0}
                  >
                    <FiMinus />
                  </button>
                  <span ref={quantityRef} className="px-6 py-3 select-none">
                    {qty}
                  </span>
                  <button
                    className="px-3 py-3 hover:bg-third hover:border-secondary hover:text-primary rounded-tr-lg rounded-bl-lg duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
                    onClick={() => setQty((q) => q + 1)}
                    disabled={
                      product?.current_stock <= 0 ||
                      Number(quantityRef?.current?.innerText) ===
                        product.current_stock - 1
                    }
                  >
                    <FiPlus />
                  </button>
                </div>

                <button
                  onClick={async () => {
                    if (product.chosen_options.available.length == 0) {
                      toast.error(t("product-details.chooseOption"));
                      return;
                    } else {
                      await addToCart(
                        product.id,
                        Number(quantityRef.current.innerText),
                        product.chosen_options.available[0].id
                      );
                      openCart();
                    }
                  }}
                  disabled={product?.current_stock <= 0}
                  className="flex-1 rounded-md h-[48px] px-4 bg-secondary hover:bg-primary text-primary hover:text-secondary font-semibold border border-secondary duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary disabled:hover:text-primary"
                >
                  {t("product-details.addToCart")}
                </button>

                {!modal ? (
                  <>
                    <button
                      onClick={async () => {
                        await addToWishlist(product.id);
                        setChanged(product.id);
                      }}
                      className="w-12 h-12   hover:border-secondary  duration-300   rounded-full flex items-center justify-center bg-third/10 hover:bg-third hover:text-primary transition"
                    >
                      <FiHeart />
                    </button>

                    <button
                      onClick={async () => {
                        const existing = compareList.find(
                          (item) => item.product?.id === product.id
                        );
                        try {
                          setIsComparing(true);
                          if (existing) {
                            // await removeFromCompare(existing.id);
                            toast.error(t("compare.alreadyexist"));
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
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-third/10 hover:bg-third hover:text-primary transition "
                    >
                      <FiRefreshCcw />
                    </button>
                  </>
                ) : null}
              </div>

              <button
                onClick={async () => {
                  await addToCart(
                    product.id,
                    Number(quantityRef.current.innerText)
                  );
                  navigate("/checkout");
                }}
                disabled={product?.current_stock <= 0}
                className="mt-4 w-full h-[52px] rounded-md bg-third hover:bg-primary text-primary hover:text-third border-third border duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary disabled:hover:text-primary"
              >
                {t("product-details.buyNow")}
              </button>
            </div>
          </div>
        )}

        {/* Overview - Short Description */}
        {!modal && product ? (
          <div className=" mx-4 py-10 md:px-10 bg-secondary/5 mt-5 rounded-lg ring-1 ring-secondary">
            <div className="flex gap-2">
              <div
                onClick={() => {
                  setOverview(true);
                  setDetails(false);
                }}
                className={` flex p-2 items-center   justify-center cursor-pointer  rounded-full transition duration-500 ${
                  overview
                    ? "bg-third text-primary  "
                    : "bg-primary text-third "
                }`}
              >
                <div
                  className={`w-10 h-10 flex items-center me-2 justify-center rounded-full transition duration-500 ${
                    overview
                      ? "bg-primary text-third  "
                      : "bg-primary text-third "
                  }`}
                >
                  <GrOverview size={30} />
                </div>
                <p className="font-bold ">{t("product-details.overview")}</p>
              </div>
              <div
                onClick={() => {
                  setOverview(false);
                  setDetails(true);
                }}
                className={` flex p-2 items-center   rounded-full justify-center cursor-pointer  transition duration-500 ${
                  details ? "bg-third text-primary  " : "bg-primary text-third "
                }`}
              >
                <div
                  className={`w-10 h-10 flex items-center rounded-full me-4 justify-center transition duration-500  ${
                    details
                      ? "bg-primary text-third "
                      : "bg-primary text-third "
                  }`}
                >
                  <TbListDetails size={30} />
                </div>
                <p className="font-bold ">{t("product-details.details")}</p>
              </div>
            </div>
            {!product?.short_description_en &&
            !product?.short_description_ar ? null : overview ? (
              <div className="py-5 px-1">
                <DecodedText
                  text={
                    lang === "en"
                      ? product?.short_description_en
                      : product?.short_description_ar ??
                        product?.short_description_en
                  }
                />
              </div>
            ) : null}
            {!product?.description_en &&
            !product?.description_ar ? null : details ? (
              <div className="py-5 px-1">
                <DecodedText
                  text={
                    lang === "en"
                      ? product?.description_en
                      : product?.description_ar ?? product?.description_en
                  }
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---------- Related Products ---------- */}
        {!loading && !error && relatedProducts.length > 0 && !modal && (
          <div className="mt-3  bg-primary pb-10 pt-3">
            <div className="  px-4 md:px-0 w-full flex !justify-center mb-4">
              <h2 className="text-2xl md:text-3xl font-extrabold  w-md text-center bg-secondary/5 ring-1 ring-secondary  p-3 rounded-lg">
                {t("product-details.related")}
              </h2>
            </div>
            <Swiper
              key={lang}
              modules={[Autoplay]}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              loop
              spaceBetween={0}
              breakpoints={{
                0: { slidesPerView: 1 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
            >
              {relatedProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className=" mx-2">
                    <ProductCard product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
