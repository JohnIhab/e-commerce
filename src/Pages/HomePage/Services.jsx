import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../Framermotion/Varient";
const MotionSection = motion.section;
import { useTranslation } from "react-i18next";
export const Services = () => {
    const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    {
      src: "/rec-1.jpg",
      label: t('Our_Services.Hand Bags'),
    },
    {
      src: "/rec.jpg",
      label: t('Our_Services.Back Packs'),
    },
    {
      src: "/Blog_3.jpg",
      label: t('Our_Services.Travel Bags'),
    },
  ];
  
  return (
    <>
      {/* Mobile (no animation) */}
      <section id="About" className="py-[24px] p-4 root lg:hidden">
        <div className="container mx-auto mb-3">
          <div className="flex items-center justify-center flex-col gap-3 ">
            <span className="mx-4 text-xl font-bold text-primary">
              {t('Our_Services.Our Services')}
            </span>
            <p className="mx-4 text-lg font-semibold">
              {t('Our_Services.All Fashion Bags between your hands')}
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3">
            {images.map((item, index) => (
              <div
                key={index}
                className="h-[320px] rounded-2xl overflow-hidden relative"
              >
                <img
                  className="h-full w-full object-cover object-center"
                  src={item.src}
                  alt={`service-${index}`}
                />
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-lg px-3 py-1 rounded-md">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop/large screens (with animation/hover) */}
      <MotionSection
        id="About"
        variants={fadeIn("down", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0 }}
        className="py-20 p-8 root hidden lg:block  bg-primary  text-third"
      >
        <div className="container mx-auto max-w-7xl mb-3  cursor-pointer">
          <div className="flex items-center justify-center flex-col gap-3 ">
            <span className="mx-4 text-xl lg:text-3xl font-bold">
              {t('Our_Services.Our Services')}
            </span>
            <p className="mx-4 text-lg lg:text-2xl font-semibold">
              {t('Our_Services.All Fashion Bags between your hands')}
            </p>
          </div>

          <div className="container mx-auto flex items-center flex-col lg:flex-row gap-x-3 gap-y-3 list-image mt-8 ">
            {images.map((item, index) => (
              <div
                key={index}
                onMouseOver={() => {
                  setActiveIndex(index);
                }}
                className={`h-[200px] lg:h-[600px]  rounded-2xl cursor-pointer overflow-hidden relative transition-all duration-300 ${
                  activeIndex === index ? "active" : ""
                }`}
              >
                <img
                  className="overflow-hidden h-full w-full object-cover"
                  src={item.src} 
                  alt={`car${index}`}
                />
                <span className="absolute bottom-4 left-4 bg-black/60 text-white lg:text-2xl px-6 py-2 rounded-md">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>
    </>
  );
};
