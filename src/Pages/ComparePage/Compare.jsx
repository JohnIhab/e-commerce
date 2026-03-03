import React, { useContext, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Helmet } from "react-helmet";
import { useCompare } from "../../context/CompareContext";
import { addToCartContext } from "../../context/AddToCartContext";
import { Cart } from "../../context/GetCartContext";
import { useCartUI } from "../../context/useCartUI";
import { useTranslation } from "react-i18next";
import Loader from "../../Components/Loader";
import AddLoader from "../../Components/AddLoader";
import no_compare from "../../assets/compare/no compare.jpg";
import { Link } from "react-router-dom";

const Compare = () => {
  const { compareList, removeFromCompare, loading } = useCompare();
  const { addToCart } = useContext(addToCartContext);
  const { setChanged: setCartChanged } = useContext(Cart);
  const { openCart } = useCartUI();
  const [addingIds, setAddingIds] = useState([]);
  const { t, i18n } = useTranslation();
  const lang = i18n?.language || "en";

  const labels = t("compare.labels", { returnObjects: true });

  const getLabel = (i) => (labels && labels[i]) || "";

  return (
    <>
      <Helmet>
        <title>JootBag | Compare</title>
        <meta name="description" content="JootBag Compare" />
      </Helmet>

      <div className="px-5 flex justify-center select-none">
        {!loading && compareList.length > 0 && (
          <div className="hidden md:flex md:w-3/12 lg:w-2/12 px-5 items-start">
            <div className="sticky left-5 top-24">
              <ul>
                {labels.map((label) => (
                  <li
                    key={label}
                    className="h-[160px] flex items-center text-2xl my-8 font-bold"
                  >
                    {label}:
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="w-full md:w-9/12 lg:w-10/12 px-2">
          <Swiper
            key={lang}
            modules={[Autoplay]}
            loop
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 },
              480: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 3 },
            }}
            className="my-5 w-full"
          >
            {loading ? (
              <p className="text-center text-3xl font-bold">
                <Loader />
              </p>
            ) : compareList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-2xl shadow-sm">
                <img
                  src={no_compare}
                  alt="Empty Compare"
                  className="w-h-64 h-64 mb-6 opacity-90"
                />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  {t("compare.empty")}
                </h2>
                <p className="text-gray-500 max-w-md mb-6">
                  {t("compare.description")}
                </p>
                <Link to="/shop">
                  <div
                    className="px-6 py-3 bg-primary text-third font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all duration-300"
                  >
                    {t("compare.start_shopping")}
                  </div>
                </Link>
              </div>

            ) : (
              compareList.map((item) => (
                <SwiperSlide
                  key={item.id}
                  className="!flex flex-col items-center shadow-lg rounded-xl p-3 bg-primary"
                >
                  <div className="relative w-full flex flex-col items-center">
                    {/* mobile-only label for image block */}
                    <p className="block md:hidden text-center font-semibold text-lg mb-2">
                      {getLabel(0)}
                    </p>
                    <div className="absolute top-3 right-1 z-10 flex flex-col items-center gap-2">
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        aria-label={t("compare.remove")}
                        title={t("compare.remove")}
                        className="h-10 w-10 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition duration-500"
                      >
                        <FaRegTrashCan />
                      </button>

                      <button
                        onClick={async () => {
                          const pid = item.product?.id;
                          if (!pid) return;
                          try {
                            setAddingIds((s) => [...s, item.id]);
                            await addToCart(pid);
                            setCartChanged(pid);
                            openCart();
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setAddingIds((s) => s.filter((i) => i !== item.id));
                          }
                        }}
                        aria-label={t("compare.addToCart")}
                        title={t("compare.addToCart")}
                        className="h-10 w-10 flex items-center justify-center bg-primary hover:bg-third hover:border-secondary text-third hover:text-primary rounded-full shadow-md transition duration-500"
                      >
                        {addingIds.includes(item.id) ? (
                          <AddLoader />
                        ) : (
                          <FaCartShopping />
                        )}
                      </button>
                    </div>

                    {/* choose language-specific fields when available */}
                    {(() => {
                      const suffix = lang === "ar" ? "ar" : "en";
                      const banner = item.product?.[`banner_${suffix}`] || item.product?.banner_en;
                      const title = item.product?.[`title_${suffix}`] || item.product?.title_en;
                      return (
                        <img
                          src={banner}
                          className="w-[250px] h-[250px] object-contain"
                          alt={title}
                        />
                      );
                    })()}

                  </div>

                  <div className="flex flex-col items-center my-5 h-[150px]">
                    <p className="block md:hidden text-center font-semibold">{getLabel(1)}</p>
                    <p className="font-bold text-lg">{item.product?.[`title_${lang === "ar" ? "ar" : "en"}`] || item.product?.title_en}</p>
                  </div>

                  <div className="flex flex-col items-center justify-center my-5 h-[150px]">
                    <p className="block md:hidden text-center font-semibold">{getLabel(2)}</p>
                    <p className="w-full text-center font-bold text-2xl">
                      {item.product?.converted?.converted_price} {" "}
                      {item.product?.converted?.[`symbol_${lang === "ar" ? "ar" : "en"}`] || item.product?.converted?.symbol_en}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center my-5 h-[150px]">
                    <p className="block md:hidden text-center font-semibold">{getLabel(3)}</p>
                    <p className="w-full text-center font-bold text-xl">
                      {item.product?.category?.[`title_${lang === "ar" ? "ar" : "en"}`] || item.product?.category?.title_en}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center my-5 h-[150px]">
                    <p className="block md:hidden text-center font-semibold">{getLabel(4)}</p>
                    <p className="w-full text-center font-bold text-xl">
                      {item.product?.current_stock}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center my-5 h-[150px]">
                    <p className="block md:hidden text-center font-semibold">{getLabel(5)}</p>
                    <p className="w-full text-center font-bold text-xl">
                      {item.product?.weight} kg
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center my-5 h-[150px]">
                    <p className="block md:hidden text-center font-semibold">{getLabel(6)}</p>
                    <p className="w-full text-center font-bold text-xl">
                      {item.product?.discount}{" "}
                      {item.product?.discount_type === "fixed"
                        ? item.product?.converted?.symbol_en
                        : "%"}
                    </p>
                  </div>


                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Compare;
