import React from "react";
import { useTranslation } from "react-i18next";
import backgroundImage from "../../assets/Home/footer.png";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Helmet } from "react-helmet";

const HeadAbout = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("about.pageTitle")}</title>
        <meta name="description" content={t("about.pageDescription")} />
      </Helmet>

      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="bg-[#07332f] px-20 py-40 text-white   overflow-hidden"
      >
        {/* Content */}
        <div className="flex items-center justify-center flex-col gap-6   z-10">
          <h1
            className={`text-3xl md:text-5xl text-white font-bold ${
              i18n.language?.startsWith("ar") ? "text-right" : "text-left"
            }`}
            dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
          >
            {t("about.heroTitle")}
          </h1>

          {/* Breadcrumb */}
          {/* <div
            className={`flex items-center gap-3 text-lg ${
              i18n.language?.startsWith("ar") ? "flex-row-reverse" : ""
            }`}
            dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
          >
            <Link
              to="/"
              className="hover:text-white transition-colors duration-300 font-medium"
            >
              {t("about.breadcrumbHome")}
            </Link>

            
            <MdOutlineKeyboardDoubleArrowRight className="text-white"/>

            <span className="text-white font-medium">
              {t("about.breadcrumbAbout")}
            </span>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default HeadAbout;
