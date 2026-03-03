import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Loader from "../../Components/Loader";
import { Link } from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import CategoryCard from "../../Components/CategoryCard";
import { useTranslation } from "react-i18next";
import ProductCard from "./../../Components/ProductCard/ProductCard";
import New from "../../assets/New.png";

import { useQuery } from "@tanstack/react-query";
import { FiTag } from "react-icons/fi";

function buildImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://ltspharma.com.kw/${path}`;
}

const NewArrival = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getNewArriavl() {
    const response = await axios.get(`${baseUrl}/products/new-arrival`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return response.data.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["NewArriavl"],
    queryFn: getNewArriavl,
  });

  useEffect(() => {
    if (data) {
      setItems(data.products.data);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (!items.length) return null;

  return (
    <div className="py-8">
      {/* Centered header */}
      <div className="text-center   px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight  relative w-60 mx-auto">
          {t("newArrival.title")}
          <img
            src={New}
            className="w-15 transform  absolute start-2 -top-5"
            alt=""
          />
        </h2>
        <p className="text-slate-500 text-sm md:text-base mt-1">
          {t("newArrival.description")}
        </p>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-base/70" />
      </div>
      <div className=" px-3">
        <Swiper
          key={lang}
          modules={[Autoplay]}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop
          // spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 1 },
            480: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 12 },
            1024: { slidesPerView: 4, spaceBetween: 15 },
          }}
        >
          {items.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="my-4">
                <ProductCard product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex justify-center w-full">
        <Link
          to="/new-arrival"
          className="flex   hover:bg-third hover:border-secondary  bg-primary  text-third duration-500 transition-all shadow-lg rounded-lg p-2  border font-bold gap-2 text-base hover:text-white items-center"
        >
          <FiTag size={25} />
          {t("newArrival.seeAll")}
        </Link>
      </div>
    </div>
  );
};

export default NewArrival;
