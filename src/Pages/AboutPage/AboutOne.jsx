import React from "react";
import { useTranslation } from "react-i18next";
import AboutOneImage from "../../assets/About/zazo-about.webp";
import AboutOneImageCartoon from "../../assets/About/stich2.png";

const AboutOne = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="container   mx-auto flex flex-col lg:flex-row items-center justify-center lg:gap-20 gap-10 py-20 px-4 md:px-12 relative">
      <img
        src={AboutOneImageCartoon}
        alt=""
        className={`hidden md:block absolute top-0 w-80 ${
          i18n.language?.startsWith("ar") ? "left-0" : "right-0"
        }`}
      />
      {/* Left Side: Image */}
      <div className="flex-1 flex justify-center mb-6 md:mb-0">
        <img
          src={AboutOneImage}
          alt="About One"
          className=" rounded-lg w-[500px]  object-cover shadow-lg"
        />
      </div>
      {/* Right Side: Text */}
      <div className="flex-1  text-base md:text-lg font-normal">
        <h2 className="font-bold text-2xl md:text-3xl text-black mb-4">
          {t("about.title")}
        </h2>
        <p className="mb-5 leading-relaxed ">{t("about.description1")}</p>
        <p className="leading-relaxed ">{t("about.description2")}</p>
      </div>
    </div>
  );
};

export default AboutOne;
