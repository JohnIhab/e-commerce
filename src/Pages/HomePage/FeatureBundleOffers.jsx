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
import BundleOfferCard from "../../Components/BundleOfferCard";

const FeaturesBundleOffers = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getFeatureBundleOffers() {
    const response = await axios.get(`${baseUrl}/bundle-offers/features`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return response.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["FeaturesBundleOffers"],
    queryFn: getFeatureBundleOffers,
  });

  useEffect(() => {
    if (data) {
 
      setItems(data.data);

      //   console.log(items);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
  }

  // if (!items.length) return null;

  return (
 <>
    {items.length>0?
     <div className="py-8">
      {/* Centered header */}
      <div className="text-center  px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {t("bundle-offer.FeaturedBundle")}
        </h2>
        <p className="text-slate-500 text-sm md:text-base mt-1">
          {t("bundle-offer.FeaturedBundleDesc")}
        </p>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-base/70" />
      </div>

      <div className=" md:px-5">
        <Swiper
          key={lang}
          modules={[Autoplay]}
          // autoplay={{ delay: 2000, disableOnInteraction: true }}
          loop
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 1 },
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 1 },
          }}
        >
          {items.slice(0, 1).map((product) => (
            <SwiperSlide key={product.id} className="flex items-stretch">
              <div className="m-4 flex-1">
                <BundleOfferCard offer={product} className="h-full" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex justify-center w-full">
        <Link
          to="/bundle-offers"
          className="flex   hover:bg-third hover:border-secondary  bg-primary  text-third duration-500 transition-all shadow-lg rounded-lg p-2  border font-bold gap-2 text-base hover:text-white items-center"
        >
          <BiSolidOffer size={25} />
          {t("bundle-offer.FeaturedBundleBtn")}
        </Link>
      </div>
    </div>:null  
  }
 </>
  );
};

export default FeaturesBundleOffers;
