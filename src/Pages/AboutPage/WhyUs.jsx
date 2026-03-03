import React from "react";
import { useTranslation } from "react-i18next";
import bg from "../../assets/Home/footer.png";
import sideImg from "../../assets/About/why4.webp";

const WhyUs = () => {
  const { t, i18n } = useTranslation();

  return (
    <section className="py-10 px-4">
      <div
        className={`max-w-7xl mx-auto grid ${
          i18n.language?.startsWith("ar")
            ? "lg:grid-cols-[520px_1fr]"
            : "lg:grid-cols-[1fr_520px]"
        } gap-8 items-stretch`}
      >
        {/* Left content with dark bg image */}
        <div
          className={`relative rounded-xl overflow-hidden ${
            i18n.language?.startsWith("ar") ? "order-2" : "order-1"
          }`}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[#0000]/85" />
          <div className="relative p-8 md:p-12 text-white">
            <h3
              className={`text-3xl md:text-4xl font-bold ${
                i18n.language?.startsWith("ar") ? "text-right" : "text-left"
              }`}
              dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
            >
              {t("about.whyUs.title")}
            </h3>
            <p
              className={`mt-4 text-white/90 leading-relaxed ${
                i18n.language?.startsWith("ar") ? "text-right" : "text-left"
              }`}
              dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
            >
              {t("about.whyUs.description")}
            </p>

            <div
              className={`mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 ${
                i18n.language?.startsWith("ar") ? "text-right" : "text-left"
              }`}
            >
              <div>
                <div className="text-4xl font-extrabold">
                  {t("about.whyUs.stats.branches.number")}
                </div>
                <div
                  className="mt-1 text-lg"
                  dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
                >
                  {t("about.whyUs.stats.branches.title")}
                </div>
                <div
                  className="text-white/80"
                  dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
                >
                  {t("about.whyUs.stats.branches.subtitle")}
                </div>
              </div>
              <div>
                <div className="text-4xl font-extrabold">
                  {t("about.whyUs.stats.clients.number")}
                </div>
                <div
                  className="mt-1 text-lg"
                  dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
                >
                  {t("about.whyUs.stats.clients.title")}
                </div>
                <div
                  className="text-white/80"
                  dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
                >
                  {t("about.whyUs.stats.clients.subtitle")}
                </div>
              </div>
              <div>
                <div className="text-4xl font-extrabold">
                  {t("about.whyUs.stats.associates.number")}
                </div>
                <div
                  className="mt-1 text-lg"
                  dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
                >
                  {t("about.whyUs.stats.associates.title")}
                </div>
                <div
                  className="text-white/80"
                  dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
                >
                  {t("about.whyUs.stats.associates.subtitle")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right image */}
        <div
          className={`rounded-xl overflow-hidden ${
            i18n.language?.startsWith("ar") ? "order-1" : "order-2"
          }`}
        >
          <img
            src={sideImg}
            alt="Why choose us"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
