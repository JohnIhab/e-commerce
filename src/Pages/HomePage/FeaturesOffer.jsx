import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Loader from "../../Components/Loader";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { BiSolidOffer } from "react-icons/bi";
import OfferCard from "../../Components/OffersCard/OfferCard";

const FeaturesOffer = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getFeatureOffers() {
    const response = await axios.get(`${baseUrl}/offers/features`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return response.data.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["FeaturesOffers"],
    queryFn: getFeatureOffers,
  });

  useEffect(() => {
    if (data) {
      setItems(data.offers.data);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (!items.length) return null;

  return (
    <div className="py-7 md:py-6 bg-[#e9e9e9]/40">
      {/* Enhanced header section */}
      <div className="text-center px-4 md:px-8 mb-3 ">
        <h2 className="text-3xl font-bold tracking-tight   ">
          {t("featured-offers.title")}
        </h2>
        <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-secondary" />
      </div>

      {/* Enhanced swiper container */}
      <div className="px-4 md:px-8 lg:px-12  ">
        <Swiper
          key={lang}
          modules={[Autoplay]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 28 },
          }}
          className="!pb-4"
        >
          {items.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <OfferCard offer={product} className="h-full" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Enhanced CTA button */}
      <div className="flex justify-center w-full px-4">
        <Link
          to="/offers"
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-to-primary hover:from-primary/90 hover:to-primary text-second rounded-xl font-semibold hover:text-gray-700 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-third transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
          <BiSolidOffer
            className="relative z-10 group-hover:rotate-12 transition-transform duration-300"
            size={24}
          />
          <span className="relative z-10">{t("featured-offers.seeAll")}</span>
          <svg
            className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default FeaturesOffer;
