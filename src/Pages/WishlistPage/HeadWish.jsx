import React from "react";
import backgroundImage from "../../assets/Home/footer.png";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Helmet } from "react-helmet";
 import { useTranslation } from "react-i18next";

const HeadWish = () => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{"JootBag | Wishlist"}</title>
        <meta name="description" content="JootBagWishlist" />
      </Helmet>

      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="bg-[#07332f] py-40 text-white relative overflow-hidden"
      >
        {/* Content */}
        <div className="flex items-center justify-center flex-col gap-6 relative z-10">
          <h1 className="text-3xl md:text-5xl text-white font-bold text-left">
            {t("wishList.title")}
          </h1>

          {/* Breadcrumb */}
          {/* <div className="flex items-center gap-3 text-lg">
            <Link
              to="/"
              className="hover:text-white transition-colors duration-300 font-medium"
            >
              {t("navigation.menu.home")}
            </Link>

            {i18n.language === "ar" ? (
              <MdOutlineKeyboardDoubleArrowLeft className="text-white"/>
            ) : (
              <MdOutlineKeyboardDoubleArrowRight className="text-white" />
            )}

            <span className="text-white font-medium">{t("wishList.title")}</span>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default HeadWish;
