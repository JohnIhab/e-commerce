import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Loader from "../../Components/Loader";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductCard from "./../../Components/ProductCard/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { FaPuzzlePiece } from "react-icons/fa6";
import last from "../../assets/Last_Piece.webp";
function buildImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://ltspharma.com.kw/${path}`;
}

const LastPieces = () => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getLastPieces() {
    const response = await axios.get(`${baseUrl}/products/last-pieces`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return response.data.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["LastPieces"],
    queryFn: getLastPieces,
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
    <div className="py-8 relative">
      {/* Centered header */}
      <div className="text-center  px-4 md:px-0">
        <div className="w-full flex justify-between items-center py-5 lg:px-20 bg-secondary text-primary">
          <h2 className="text-2xl md:text-3xl text-start font-extrabold tracking-tight flex flex-col mx-2">
            {t("lastPieces.title")}
            <span className="text-slate-500 text-sm md:text-base mt-1">
              {t("lastPieces.description")}
            </span>
          </h2>
          <img
            src={last}
            className="lg:w-50 w-30 mx-2"
            alt={t("lastPieces.imageAlt")}
          />
        </div>

        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-base/70" />
      </div>
      <div className="px-3 ">
        <Swiper
          key={lang}
          modules={[Autoplay]}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 1 },
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
          to="/last-pieces"
          className="flex   hover:bg-third hover:border-secondary  bg-primary  text-third duration-500 transition-all shadow-lg rounded-lg p-2  border font-bold gap-2 text-base hover:text-white items-center"
        >
          <FaPuzzlePiece size={25} />
          {t("lastPieces.seeAll")}
        </Link>
      </div>
      <div className="absolute transform rotate-35 top-120 end-10 animate-pulse">
        <FaPuzzlePiece className="text-[#0000001e]" size={150} />
      </div>
    </div>
  );
};

export default LastPieces;
