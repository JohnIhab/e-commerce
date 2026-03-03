import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import homeImage from "../../assets/Home/home.png";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = () => {
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [slider, setSlider] = useState([]);
  const { t, i18n } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);

  const lang = i18n.language;

  const [activeSlide, setActiveSlide] = useState(0);

  const sortedSlides = (slider || [])
    .slice()
    .sort((a, b) => Number(a.order) - Number(b.order));

  const currentSlide = sortedSlides[activeSlide] ?? sortedSlides[0] ?? null;

  const titleVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };
  async function getSlider() {
    const response = await axios.get(`${baseUrl}/sliders`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return response.data.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["Slider"],
    queryFn: getSlider,
  });

  useEffect(() => {
    if (data) {
      setSlider(data);
      setActiveSlide(0);
    }
  }, [data]);

  return (
    <section className="lg:h-[92vh] h-[45vh] flex flex-col lg:flex-row  w-full pt-25 lg:pt-0">
      {/* <div className="w-full lg:w-4/12  flex items-center justify-center p-8 lg:p-12 order-2 lg:order-1">
        <div className="max-w-md space-y-6 lg:space-y-8">
           <div className="space-y-3 lg:space-y-4">
            {currentSlide ? (
              <>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold flex items-center gap-2  text-third leading-tight">
                  {lang === "ar" ? currentSlide.title_ar : currentSlide.title_en}
                </h1>

                <div className="flex gap-4">
                  <a
                    href={currentSlide.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-third text-primary border-2 border-third px-12 py-3 rounded font-semibold text-center transition-colors duration-500 hover:bg-transparent hover:text-third inline-block"
                  >
                    {t("hero-slider.See More")}
                  </a>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div> */}

      <div className="w-full lg:w-full relative order-1 lg:order-2 h-full lg:h-auto ">
        <Swiper
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          key={lang}
          // loop={true}
          modules={[Autoplay]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="  w-full h-full"
          onInit={(swiper) => {
            setActiveSlide(swiper.activeIndex);
          }}
         
        >
          {sortedSlides.map((slide, index) => (

              <SwiperSlide
          key={slide.id ?? index}
          className="relative w-full h-full overflow-hidden"
        >
          <motion.div
            key={activeIndex === index ? `zoom-${index}` : `static-${index}`}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${
                lang === "en" ? slide.banner_en : slide.banner_ar
              })`,
            }}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 2.5,
              ease: "easeOut",
            }}
          />

          <a
            href={slide.link}
            target="_blank"
            className="relative z-10 flex flex-col h-full justify-center items-center px-10"
          ></a>
        </SwiperSlide>
            // <SwiperSlide
            //   key={slide.id ?? index}
            //   className="w-full h-full bg-cover bg-no-repeat bg-center "
            //   style={{
            //     backgroundImage: `url(${
            //       lang === "en" ? slide.banner_en : slide.banner_ar
            //     })`,
            //   }}
            //  >
            //   <img
            //     src={lang === "en" ? slide.banner_en : slide.banner_ar}
            //     alt={lang === "en" ? slide.title_en : slide.title_ar}
            //     className="object-cover w-full h-full"
            //   />
            //   <a href={currentSlide.link} target="_blank" className=" flex flex-col h-full justify-center items-center px-10  ">
               
            //     <AnimatePresence mode="wait">
            //       <motion.h1
            //         key={activeSlide + "-title"}
            //         variants={titleVariants}
            //         initial="hidden"
            //         animate="visible"
            //         exit="hidden"
            //         className="overflow-hidden min-w-fit text-2xl lg:text-4xl xl:text-3xl font-bold inline shadow-lg m-5 items-center gap-2 text-primary leading-tight"
            //       >
            //         <span className="flex top-10  p-4">
            //           {lang === "ar"
            //             ? currentSlide.title_ar
            //             : currentSlide.title_en}
            //         </span>
            //       </motion.h1>
            //     </AnimatePresence>

            //     <AnimatePresence mode="wait">
            //       <motion.a
            //         key={activeSlide + "-btn"}
            //         href={currentSlide.link}
            //         target="_blank"
            //         rel="noreferrer"
            //         variants={buttonVariants}
            //         initial="hidden"
            //         animate="visible"
            //         exit="hidden"
            //         className="bg-third text-primary border-2 border-third px-12 py-3 rounded-lg font-semibold text-center transition-colors duration-500 hover:bg-secondary hover:text-primary inline-block"
            //       >
            //         {t("hero-slider.See More")}
            //       </motion.a>
            //     </AnimatePresence>
            //   </a>
            // </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900/20"></div>
      </div>
    </section>
  );
};

export default HeroSection;
