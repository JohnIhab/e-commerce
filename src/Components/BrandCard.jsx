import React from "react";
import { useTranslation } from "react-i18next";

const BrandCard = ({ Brand }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n && i18n.language && i18n.language.startsWith("ar");
  const title = isArabic ? Brand.title_ar || Brand.title_en : Brand.title_en;

  return (
    <div className="flex flex-col items-center gap-5  ">
      <div className="w-[330px] h-[363px] overflow-hidden rounded-lg group">
        <img
          src={Brand.icon ? Brand.icon : Brand.banner_en}
          alt={Brand.title_en}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out delay-150 origin-center group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>
      <div className="text-center text-lg font-bold truncate">
        {title}
      </div>
      
    </div>
  );
};

export default BrandCard;
