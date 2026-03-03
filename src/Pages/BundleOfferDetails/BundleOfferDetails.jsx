import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/Loader";
import { ApiAuthContext } from "../../context/AuthContext";
import { TbPackages, TbRosette } from "react-icons/tb";
import { FaClock, FaPercentage } from "react-icons/fa";
import CountDownTimer from "../../Components/CountDownTimer";
import { addBundleToCartContext } from "../../context/AddBundleToCartContext";

const BundleOfferDetails = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { addToCart } = useContext(addBundleToCartContext);

  const [cards, setCards] = useState([]);
  const [bundleData, setbundlaData] = useState([]);
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);

  async function getOfferBySlug() {
    const response = await axios.get(`${baseUrl}/bundle-offers/${slug}`, {
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
      setbundlaData(data);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${
            lang === "en" ? data.banner_en : data.banner_ar ?? data.banner_en
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="bg-[#07332f] py-20 text-white relative overflow-hidden aspect-[50/12] flex items-center justify-center   shadow-sm   rounded-xl   mx-10 my-4 "
      >
        <div className=" flex text-shadow-lg  items-center justify-center text-6xl font-bold gap-3 backdrop-blur-md shadow-sm bg-[#10020289] p-2 rounded-xl w-full mx-5 ">
          <div className="relative flex">
            <TbRosette
              className="animate-spin spin-"
              style={{ animationDuration: "3s" }}
            />
            <FaPercentage className="absolute inset-4.5" size={25} />
          </div>

          <p className="">
            {lang == "en" ? data?.title_en : data?.title_ar ?? data?.title_en}
          </p>
          <div className="relative flex">
            <TbRosette
              className="animate-spin spin-"
              style={{ animationDuration: "3s" }}
            />
            <FaPercentage className="absolute inset-4.5" size={25} />
          </div>
        </div>
      </div>
      {data.end_at ? (
        <div className="flex justify-center items-center gap-2 z-[9000] bg-secondary text-2xl mt-4 mx-4 rounded-2xl !text-white p-2  ">
          <FaClock size={30} className="text-primary" />
          <CountDownTimer targetDate={data.end_at} />
        </div>
      ) : null}
      <div className="flex  flex-wrap py-8  space-y-5 mx-9 ">
        {cards.map((card) => (
          <>
            <div className="lg:w-4/12 w-full flex justify-center  ">
              <div className="w-11/12">
                <ProductCard product={card} />
              </div>
            </div>
          </>
        ))}
      </div>
      <div className="w-full flex justify-center my-5">
        <button
          onClick={async () => {
            await addToCart(bundleData.id);
            setCartChanged(Date.now());
          }}
          className="rounded-lg border-third border duration-500 bg-third text-primary hover:text-third hover:bg-primary p-3 gap-2 flex items-center"
        >
          <TbPackages />
          {t("bundle-offer.addBundle")}
        </button>
      </div>
    </>
  );
};

export default BundleOfferDetails;
