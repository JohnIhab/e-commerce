import React from "react";
import { useTranslation } from "react-i18next";

const Slider = () => {
  const { t, i18n } = useTranslation();
  const isArabic = Boolean(i18n?.language && i18n.language.startsWith("ar"));

  const sliderItems = t("hero-slider.items", { returnObjects: true }) || [
    "Travel Right",
    "Discover Your Perfect Bag",
    "Explore New Bag Collections",
    "Pack Smart, Travel Stylish",
    "Find The Perfect Travel Companion",
    "Travel Light, Travel Smart",
    "Quality Bags for Every Journey",
    "Style Meets Functionality",
  ];

  return (
    <div className="bg-third text-primary py-4 overflow-hidden group shadow-lg">
      <div className="relative">
        <div
          className={`flex ${
            isArabic ? "flex-row-reverse" : ""
          } animate-scroll group-hover:pause-scroll whitespace-nowrap `}
          style={{ animationDirection: isArabic ? "reverse" : "normal" }}
          dir={isArabic ? "rtl" : "ltr"}
          aria-hidden={false}
        >
          {sliderItems.map((item, index) => (
            <div
              key={`first-${index}`}
              dir={isArabic ? "rtl" : "ltr"}
              className={`flex-shrink-0 px-8 text-lg font-medium hover:text-third transition-colors duration-300 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {item}
            </div>
          ))}
          {/* Duplicate items for seamless loop */}
          {sliderItems.map((item, index) => (
            <div
              key={`second-${index}`}
              dir={isArabic ? "rtl" : "ltr"}
              className={`flex-shrink-0 px-8 text-lg font-medium hover:text-third transition-colors duration-300 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
