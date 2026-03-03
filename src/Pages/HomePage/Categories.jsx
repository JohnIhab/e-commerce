import React, { use, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Loader from "../../Components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import CategoryCard from "../../Components/CategoryCard";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn } from "../../Framermotion/Varient";
const MotionSection = motion.section;

function buildImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://ltspharma.com.kw/${path}`;
}

const Categories = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const endpoint = useMemo(
    () => `${baseUrl}/product-categories/features?number=4`,
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
    <>
      {/* Mobile (no animation) */}
      <section id="About" className="py-[24px] p-4 root lg:hidden">
        <div className="container mx-auto mb-3">
          <div className="flex items-center justify-center flex-col gap-3 ">
            <span className="mx-4 text-xl font-bold text-third">
              {t("categories.title")}
            </span>
            <p className="mx-4 text-lg font-semibold">
              {t("categories.description")}
            </p>
          </div>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            loop
            className="mt-5"
          >
            {items.map((item, index) => (
              <SwiperSlide>
                <div
                  onClick={() =>
                    navigate(
                      `/categories/${
                        lang === "en"
                          ? item.slug_en
                          : item.slug_ar ?? item.slug_en
                      }`
                    )
                  }
                  key={index}
                  className="h-[320px] rounded-2xl overflow-hidden relative cursor-pointer shadow-lg"
                >
                  <img
                    className="h-full w-full object-cover object-center"
                    src={
                      lang === "en"
                        ? item.banner_en
                        : item.banner_ar ?? item.banner_en
                    }
                    alt={`service-${index}`}
                  />
                  <span className="absolute bottom-2 start-2 bg-black/60 text-white text-lg px-3 py-1 rounded-md">
                    {lang === "en"
                      ? item.title_en
                      : item.title_ar ?? item.title_en}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Desktop/large screens (with animation/hover) */}
      <MotionSection
        id="About"
        variants={fadeIn("down", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0 }}
        className="  p-8 root hidden lg:block  bg-primary  text-third"
      >
        <div className="container mx-auto max-w-7xl mb-3  cursor-pointer">
          <div className="flex items-center justify-center flex-col gap-3 ">
            <span className="mx-4 text-xl lg:text-3xl font-bold">
              {t("categories.title")}
            </span>
            <p className="mx-4 text-lg lg:text-2xl font-semibold">
              {t("categories.description")}
            </p>
          </div>

          <div className="container mx-auto flex items-center flex-col lg:flex-row gap-x-3 gap-y-3 list-image mt-8 ">
            {items.map((item, index) => (
              <div
                onClick={() =>
                  navigate(
                    `/categories/${
                      lang === "en"
                        ? item.slug_en
                        : item.slug_ar ?? item.slug_en
                    }`
                  )
                }
                key={index}
                onMouseOver={() => {
                  setActiveIndex(index);
                }}
                className={` shadow-md shadow-secondary h-[200px] lg:h-[400px]  rounded-2xl cursor-pointer overflow-hidden relative transition-all duration-300 ${
                  activeIndex === index ? "active shadow-third" : ""
                }`}
              >
                <img
                  className="overflow-hidden h-full w-full object-cover"
                  src={
                    lang === "en"
                      ? item.banner_en
                      : item.banner_ar ?? item.banner_en
                  }
                  alt={`car${index}`}
                />
                <span className="absolute bottom-4 start-4 bg-black/60 text-white lg:text-xl px-6 py-2 rounded-md">
                  {lang === "en"
                    ? item.title_en
                    : item.title_ar ?? item.title_en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <div className="flex justify-center w-full">
        <Link
          to="/categories"
          className="flex    hover:bg-third hover:border-secondary  bg-primary  text-third duration-500 transition-all shadow-lg rounded-lg p-2  border font-bold gap-2 text-base hover:text-white items-center"
        >
          <BiCategory size={25} />
          {t("categories.seeAll")}
        </Link>
      </div>
    </>
  );
};

export default Categories;
