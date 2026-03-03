import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdOutlineLocalShipping } from "react-icons/md";
import { TbClockHour5Filled } from "react-icons/tb";
import { RiSecurePaymentFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../context/Settings";

const Newest = () => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const isArabic = Boolean(i18n?.language && i18n.language.startsWith('ar'));
  const features = [
    { Icon: MdOutlineLocalShipping, label: t("newest.free_shipping") },
    { Icon: TbClockHour5Filled, label: t("newest.delivery_on_time") },
    { Icon: RiSecurePaymentFill, label: t("newest.secure_payment") },
  ];
  const {
    isCustomBanner,
    CustomBannerEn,
    CustomBannerAr,
    CustomTextEn,
    CustomTextAr,
  } = useContext(SettingsContext);

  useEffect(() => {
    if (!isCustomBanner) {
      return;
    }
  }, []);

  return (
    <div className="flex flex-col ">
      <div
        className="px-10 relative flex items-end aspect-[30/12] bg-cover gap-10 text-primary   justify-center"
        style={{
          backgroundImage: `url(${lang === "en" ? CustomBannerEn:CustomBannerAr})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition :"center"

        }}
      >
        <div className="absolute inset-0 flex items-end  " />
        {/* <h3 className="text-6xl relative font-semibold py-5  text-center">
          {lang === "en" ? CustomTextEn:CustomTextAr}
        </h3> */}
        <div className="mb-10">
          <Link
            to="/shop"
            className="py-2 px-6  backdrop-blur-md border-primary border-2  hover:backdrop-blur-2xl font-bold text-2xl rounded-lg  duration-500"
          >
            {t("newest.shop_now")}
          </Link>
        </div>
      </div>

      <div className="py-5 border-third/10 border-t border-b text-third overflow-hidden group">
        <div className="relative">
          <div
            className={`flex ${isArabic ? 'flex-row-reverse' : ''} animate-scroll group-hover:pause-scroll whitespace-nowrap`}
            style={{ animationDirection: isArabic ? 'reverse' : 'normal' }}
            dir={isArabic ? 'rtl' : 'ltr'}
            aria-hidden={false}
          >
            {features.map(({ Icon, label }, index) => (
              <div
                key={`feat-first-${index}`}
                className={`inline-flex items-center gap-3 px-40`}
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <Icon size={50} />
                <p className="text-3xl font-bold">{label}</p>
              </div>
            ))}
            {features.map(({ Icon, label }, index) => (
              <div
                key={`feat-second-${index}`}
                className={`inline-flex items-center gap-3 px-40`}
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <Icon size={50} />
                <p className="text-3xl font-bold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newest;
