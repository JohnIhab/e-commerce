import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BiSolidOffer } from "react-icons/bi";
import { Cart } from "../context/GetCartContext";
import { addBundleToCartContext } from "../context/AddBundleToCartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import ProductCard from "./ProductCard/ProductCard";
import { TbPackages } from "react-icons/tb";
import { useCartUI } from "../context/useCartUI";

const BundleOfferCard = ({ offer }) => {
  const { addToCart } = useContext(addBundleToCartContext);
  const { setChanged: setCartChanged } = useContext(Cart);
  const { t, i18n } = useTranslation();
  const { openCart } = useCartUI();

  const lang = i18n.language;

  if (!offer) return null;

  const title =
    lang === "en" ? offer.title_en : offer.title_ar ?? offer.title_en;
  const banner =
    lang === "en" ? offer.banner_en : offer.banner_ar ?? offer.banner_en;
  const slug = lang === "en" ? offer.slug_en : offer.slug_ar ?? offer.slug_en;
  const offerHref = `/bundle-offers/${slug}`;

  return (
    <>
      {/* ----------- Desktop Layout ----------- */}
      <div className=" rounded-xl shadow-md transition-all duration-200 overflow-hidden w-full hidden lg:flex flex-col justify-center px-3 aspect-[9/3]">
        <div className="w-full flex items-center gap-10">
          {/* Left Side - Products */}
          <div className="w-6/12 overflow-hidden rounded-xl p-20">
            <Swiper
              modules={[Autoplay]}
              slidesPerView={2}
              loop={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              spaceBetween={0}
              speed={800}
              className="h-full"
            >
              {offer.products.map((product) => (
                <SwiperSlide key={product.id} className="h-full">
                  <div className="w-11/12">
                    <ProductCard product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="w-full flex flex-col items-center mt-5 justify-center">
              <p className="mb-3">
                {t("bundle-offer.addBundle")}{" "}
                <span className="font-bold">
                  {lang == "en"
                    ? offer.converted.symbol_en
                    : offer.converted.symbol_ar ?? offer.converted.symbol_en}
                  {offer.converted.converted_balance}
                </span>
              </p>

              <button
                onClick={async () => {
                  await addToCart(offer.id);
                  setCartChanged(Date.now());
                  openCart();
                }}
                className="rounded-lg border-third border duration-500 bg-third text-primary hover:text-third hover:bg-primary p-3 gap-2 flex items-center"
              >
                <TbPackages />
                {t("bundle-offer.addBundle")}
              </button>
            </div>
          </div>

          {/* Right Side - Offer Image */}
          <div className="w-6/12 flex justify-center p-20 ">
            <Link to={offerHref}>
              <div className="flex items-center w-full h-full min-h-[450px] overflow-hidden relative">
                <div className="absolute top-3 start-50 transform -translate-x-50 z-50 w-full py-2 flex items-center justify-center rounded-xl">
                  <div className="flex items-center gap-2 bg-primary/90 shadow-sm px-3 py-1 rounded-md">
                    <BiSolidOffer
                      className="text-black animate-pulse"
                      size={25}
                    />
                    <span className="text-lg font-semibold text-black animate-pulse">
                      {title}
                    </span>
                  </div>
                </div>

                <img
                  src={banner}
                  alt={title}
                  className="object-cover h-full  rounded-xl brightness-75"
                />

                <div className="flex absolute w-full gap-5 h-full backdrop-blur-[2px] items-center px-5">
                  <div className="w-6/12">
                    <Swiper
                      modules={[Autoplay]}
                      autoplay={{ delay: 1200, disableOnInteraction: true }}
                      loop
                      spaceBetween={20}
                      breakpoints={{
                        0: { slidesPerView: 1 },
                        480: { slidesPerView: 1 },
                        768: { slidesPerView: 1 },
                        1024: { slidesPerView: 1 },
                      }}
                    >
                      {offer.products.map((product) => (
                        <SwiperSlide key={product.id}>
                          <img
                            src={
                              lang === "en"
                                ? product.banner_en
                                : product.banner_ar ?? product.banner_en
                            }
                            className="w-70 h-70"
                            alt={product.title_en}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="flex flex-col items-end gap-3 w-6/12">
                    <span className="text-third text-4xl font-bold bg-primary inline-block">
                      {t("bundle-offer.the")}
                    </span>
                    <span className="text-third text-4xl font-bold bg-primary inline-block">
                      {t("bundle-offer.bundle")}
                    </span>
                    <span className="text-third text-4xl font-bold bg-primary inline-block">
                      {t("bundle-offer.contains")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ----------- Mobile Layout ----------- */}
      <div className=" rounded-xl shadow-md transition-all duration-200 overflow-hidden w-full flex lg:hidden flex-col justify-center px-3 aspect-[3/6]">
        <div className="w-full flex-col flex items-center gap-10">
          {/* Top Image */}
          <div className="w-full flex justify-center">
            <Link to={offerHref}>
              <div className="flex items-center w-full h-full overflow-hidden relative">
                <div className="absolute top-3 start-50 transform -translate-x-50 z-50 w-full py-2 flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-primary/90 shadow-sm px-3 py-1 rounded-md">
                    <BiSolidOffer
                      className="text-black animate-pulse"
                      size={25}
                    />
                    <span className="text-lg font-semibold text-black animate-pulse">
                      {title}
                    </span>
                  </div>
                </div>
                <img
                  src={banner}
                  alt={title}
                  className="object-cover h-[400px] w-[400px] rounded-xl brightness-75"
                />

                <div className="flex absolute w-full gap-5 h-full backdrop-blur-[2px] items-center px-5">
                  <div className="w-6/12">
                    <Swiper
                      modules={[Autoplay]}
                      autoplay={{ delay: 1200, disableOnInteraction: true }}
                      loop
                      spaceBetween={20}
                      breakpoints={{
                        0: { slidesPerView: 1 },
                        480: { slidesPerView: 1 },
                        768: { slidesPerView: 1 },
                        1024: { slidesPerView: 1 },
                      }}
                    >
                      {offer.products.map((product) => (
                        <SwiperSlide key={product.id}>
                          <img
                            src={
                              lang === "en"
                                ? product.banner_en
                                : product.banner_ar ?? product.banner_en
                            }
                            alt={product.title_en}
                            className="w-60 h-60"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="flex flex-col items-end gap-3 w-6/12">
                    <span className="text-third text-4xl font-bold bg-primary inline-block">
                      {t("bundle-offer.the")}
                    </span>
                    <span className="text-third text-4xl font-bold bg-primary inline-block">
                      {t("bundle-offer.bundle")}
                    </span>
                    <span className="text-third text-4xl font-bold bg-primary inline-block">
                      {t("bundle-offer.contains")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Products */}
          <div className="w-full flex items-center flex-col rounded-xl">
            <Swiper
              modules={[Autoplay]}
              slidesPerView={2}
              loop={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              spaceBetween={5}
              speed={800}
              className="h-full w-full"
            >
              {offer.products.map((product) => (
                <SwiperSlide key={product.id} className="h-full   ">
                  <div className="w-full">
                    <ProductCard product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="w-full flex flex-col items-center mt-5 justify-center">
              <p className="mb-3">
                {t("bundle-offer.addBundle")}{" "}
                <span className="font-bold">
                  {lang == "en"
                    ? offer.converted.symbol_en
                    : offer.converted.symbol_ar ?? offer.converted.symbol_en}
                  {offer.converted.converted_balance}
                </span>
              </p>
              <button
                onClick={async () => {
                  await addToCart(offer.id);
                  setCartChanged(Date.now());
                }}
                className="rounded-lg border-third border bg-third text-primary hover:text-third hover:bg-primary p-3 gap-2 flex items-center mb-14"
              >
                <TbPackages />
                {t("bundle-offer.addBundle")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BundleOfferCard;
