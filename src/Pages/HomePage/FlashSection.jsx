import React, { useState, useEffect, useContext } from "react";
// import activelogo from "../../assets/Home/Logo_Header.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion } from "framer-motion";
import { Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { IoFlashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import FlashCard from "./../../Components/FlashCard";
import { TbRosette } from "react-icons/tb";
import { FaPercentage } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/Loader";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";


const FlashSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [cards, setCards] = useState([]);
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);

  async function getOffers() {
    const response = await axios.get(`${baseUrl}/products/today-deals`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return response.data.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["today-deals"],
    queryFn: getOffers,
  });

  useEffect(() => {
    if (data) {
      console.log(data.products.data);
      
      setCards(data.products.data);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
    {cards.length>0 ? <>
        <div
        className="lg:pl-18 py-3  text-third mb-5"
        style={{ backgroundColor: "#F8F8F8" }}
      >
        <div className="flex items-center justify-center flex-col gap-3 py-5">
          <span className="mx-4  font-bold flex gap-3 items-center text-primary">
            <div className="flex flex-col items-center text-center pb-6">
              <p className="text-4xl  text-third">
                {t("featured-flash.title")}
              </p>
              <p className="text-third">{t("featured-flash.desc")}</p>
            </div>
          </span>
        </div>
        <Swiper
          key={lang}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          modules={[Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          speed={1200}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 1 },
          }}
          className="w-full py-10"
        >
          {cards?.map((card) => (
            <SwiperSlide key={card.id} className="">
              <FlashCard
                // date="2026-12-31 23:59:59"
                date={card.end_at}
                img={
                  lang === "en"
                    ? card.banner_en
                    : card.banner_ar ?? card.banner_en
                }
                title={
                  lang === "en" ? card.title_en : card.title_ar ?? card.title_en
                }
                description={
                  lang === "en"
                    ? card.description_en
                    : card.description_ar ?? card.description_en
                }
                slug={
                  lang === "en" ? card.slug_en : card.slug_ar ?? card.slug_en
                }
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* <div className=" w-4/12 flex flex-col items-center shadow-sm m-2 p-5 relative ">
        <div className="flex justify-center items-center gap-2 bg-primary absolute top-0 end-0 text-white p-1   rounded-bl-xl mb-3">
            <FaClock size={20}/>
          <CountdownTimer targetDate="2025-12-31T23:59:59" />
        </div>
        <div className="flex justify-center items-center gap-2 bg-primary absolute top-0 start-0 text-white p-1 rounded-br-xl   mb-3">
             
            <h3 className="text-xl font-bold">Flash Category</h3>
           
        </div>

        <img src={activelogo} className="my-5" alt="" />
        <h3 className="">Flash Title</h3>
      </div> */}
      </div>
      {/* <div
        className="w-full flex justify-center p-6"
        style={{ backgroundColor: "#F8F8F8" }}
      >
        <Link
          to="/flashdeals"
          className="flex   hover:bg-third hover:border-secondary  bg-primary  text-third duration-500 transition-all shadow-lg rounded-lg p-2  border font-bold gap-2 text-base hover:text-white items-center"
        >
          <IoFlashOutline size={25} />
          {t("featured-flash.seeAll")}
        </Link>
      </div> */}
    </>:null}
    </>
  );
};

export default FlashSection;
