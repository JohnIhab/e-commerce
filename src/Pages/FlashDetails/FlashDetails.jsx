import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/Loader";
import { ApiAuthContext } from "../../context/AuthContext";
import { TbRosette } from "react-icons/tb";
import { FaClock, FaPercentage } from "react-icons/fa";
import CountDownTimer from "../../Components/CountDownTimer";

const FlashDetails = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [cards, setCards] = useState([]);
  const [flashData, setFlashData] = useState([]);
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);

  async function getOfferBySlug() {
    const response = await axios.get(`${baseUrl}/offers/${slug}`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return response.data.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["OfferBySlug"],
    queryFn: getOfferBySlug,
  });

  useEffect(() => {
    if (data) {

      setCards(data.products);
      setFlashData(data);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${(lang === "en" ? data?.banner_en ?? data?.banner_ar : data?.banner_ar ?? data?.banner_en)})`,
        }}
        className="bg-[#07332f] text-white relative overflow-hidden bg-center bg-no-repeat bg-cover py-20 md:py-28 lg:py-40"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center text-center gap-3">


            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-shadow-lg">
              {lang === "en"
                ? data?.title_en ?? data?.title_ar
                : data?.title_ar ?? data?.title_en}
            </h1>

          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2 z-[9000] bg-secondary text-2xl mt-4 mx-4 rounded-2xl !text-white p-2  ">
        <FaClock size={30} className="text-primary" />
        <CountDownTimer targetDate={data.end_at} />
      </div>
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {cards?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <div key={card?.id ?? card?.sku ?? JSON.stringify(card)} className="flex justify-center">
                  <div className="w-full">
                    <ProductCard product={card} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted">{"No products found"}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default FlashDetails;
