import React, { useState, useEffect, useContext } from "react";
import { RiDiscountPercentLine } from "react-icons/ri";
import backgroundImage from "../../assets/Home/footer.png";
import { TbRosette } from "react-icons/tb";
import { FaPercentage } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/Loader";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

const FlashDealsPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);

  const [cards, setCards] = useState([]);

  async function getOffers() {
    const response = await axios.get(`${baseUrl}/offers/features`, {
      headers: { "X-API-KEY": XApiKey },
    });
    return response.data.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["Offers"],
    queryFn: getOffers,
  });

  useEffect(() => {
    if (data) {
      setCards(data.offers.data);
    }
  }, [data]);

  if (isLoading) return <Loader />;

  return (
    <>
      {/* Header Section */}
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="bg-[#07332f] py-40 text-white relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center text-3xl sm:text-5xl md:text-6xl font-bold gap-2 sm:gap-6">
          <div className="relative flex items-center justify-center">
            <TbRosette className="animate-spin w-12 h-12  " style={{ animationDuration: "3s" }} />
            {/* center the percentage icon over the rosette using inset-0 and flex */}
            <FaPercentage className="absolute inset-3 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <p className="mt-2 sm:mt-0">{t("featured-flash.Flash Deals")}</p>

          <div className="relative flex items-center justify-center">
            <TbRosette className="animate-spin w-12 h-12" style={{ animationDuration: "3s" }} />
            <FaPercentage className="absolute inset-3 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        
      </div>

      {/* Flash Cards Section */}
      <div className="container mx-auto px-4 py-10">
        {cards?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card) => (
              <OfferCard
                key={card.id}
                image={lang?.startsWith("ar") ? card.banner_ar : card.banner_en}
                title={lang?.startsWith("ar") ? card.title_ar : card.title_en}
                description={lang?.startsWith("ar") ? card.description_ar : card.description_en}
                discount={card.discount_percentage}
                endDate={card.end_date}
                slug={
                  lang?.startsWith("ar")
                    ? card.slug_ar || card.slug || card.id
                    : card.slug_en || card.slug || card.id
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg py-20">
            {t("featured-flash.No offers available at the moment")}
          </div>
        )}
      </div>
    </>
  );
};

/* ---------------------- NEW OFFER CARD COMPONENT ---------------------- */
const OfferCard = ({ image, title, description, discount, endDate, slug }) => {
  // get translation function locally (was causing `t is not defined` when used below)
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endDate) return;

    // helper to compute and set remaining time. Returns false when expired.
    const update = () => {
      const diff = new Date(endDate) - new Date();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return false;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      return true;
    };

    // set immediately (avoids waiting for the first interval)
    const stillActive = update();

    if (!stillActive) return;

    const interval = setInterval(() => {
      const active = update();
      if (!active) clearInterval(interval);
    }, 60000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover"
        />
        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <RiDiscountPercentLine size={16} /> {discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>

        {/* Countdown */}
        {timeLeft && (
          <div className="text-sm font-semibold text-green-700">
            ⏳ {t('featured-flash.Ends in')}: {timeLeft}
          </div>
        )}

        {/* Button */}
        
        <Link
          to={`/flashdeals/${slug}`}
          className="mt-3 inline-block text-center bg-[#07332f] text-white py-2 rounded-lg hover:bg-[#095c53] transition"
        >
          {t('featured-flash.View deal')}
        </Link>
      </div>
    </motion.div>
  );
};

export default FlashDealsPage;
