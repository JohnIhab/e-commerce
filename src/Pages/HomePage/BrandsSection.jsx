import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Loader from "../../Components/Loader";
import BrandCard from "./../../Components/BrandCard";
import { useTranslation } from "react-i18next";
import bgBrand from "../../assets/Brands/hand-arrange-white-letters-brand.jpg";

const BrandsSection = () => {
  const { t , i18n } = useTranslation();
  const lang = i18n.language;

  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const endpoint = useMemo(
    () => `${baseUrl}/product-category-brands/features`,
    [baseUrl]
  );

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const { data } = await axios.get(endpoint, {
          headers: {
            "X-API-KEY": XApiKey,
          },
        });
        if (!isMounted) return;

        setItems(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        // ignore for now
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  if (loading) {
    return <Loader />;
  }

  if (!items.length) return null;

  return (
    <div className="py-8 relative overflow-hidden">
      {/* Background layer: blurred and semi-transparent */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 blur-md opacity-30 z-0"
        style={{ backgroundImage: `url(${bgBrand})` }}
      />

      <div className="relative z-10">
        {/* Centered header */}
        <div className="text-center   px-4 md:px-0">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {t("product-brand.Shop by Brands")}
          </h2>
          <p className="text-slate-500 text-sm md:text-base mt-1">
            {t("product-brand.Discover our most popular sections")}
          </p>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-base/70" />
        </div>
        <div className=" md:px-5">
          <Swiper
            key={lang}
            modules={[Autoplay]}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            loop
            breakpoints={{
              0: { slidesPerView: 1 },
              480: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {items.map((Brand) => (
              <SwiperSlide key={Brand.id}>
                <BrandCard Brand={Brand} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* <div className="flex justify-center w-full mt-5">
        <Link
        to="/Brands"
        className="flex   hover:bg-third hover:border-secondary  bg-primary  text-third duration-500 transition-all shadow-lg rounded-lg p-2  border font-bold gap-2 text-base hover:text-white items-center"
      >
        <BiCategory size={25} />
        See All Brands
      </Link>
      </div> */}
      </div>
    </div>
  );
};

export default BrandsSection;
