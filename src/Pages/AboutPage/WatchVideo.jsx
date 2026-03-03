import React from "react";
import { useTranslation } from "react-i18next";
import bg from "../../assets/About/bg2.png";
import { FiPlay } from "react-icons/fi";

const WatchVideo = () => {
  const { t, i18n } = useTranslation();

  return (
    <section
      className="relative  text-white"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-third/50" />
      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-40 text-center">
        <h2
          className={`text-3xl md:text-5xl font-bold ${
            i18n.language?.startsWith("ar") ? "text-center" : "text-center"
          }`}
          dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
        >
          {t("about.videoSection.title")}
        </h2>
        <p
          className={`max-w-4xl mx-auto mt-5 text-lg leading-relaxed text-white ${
            i18n.language?.startsWith("ar") ? "text-center" : "text-center"
          }`}
          dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
        >
          {t("about.videoSection.description")}
        </p>

        <div
          className={`mt-8 flex items-center ${
            i18n.language?.startsWith("ar") ? "flex-row-reverse" : ""
          } justify-center gap-3`}
        >
          <button
            aria-label={t("about.videoSection.playVideo")}
            className="w-10 h-10 rounded-full border-2 border-white/70 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <FiPlay />
          </button>
          <span
            className={`underline underline-offset-4 cursor-pointer ${
              i18n.language?.startsWith("ar") ? "mr-2" : "ml-2"
            }`}
            dir={i18n.language?.startsWith("ar") ? "rtl" : "ltr"}
          >
            {t("about.videoSection.watchVideo")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default WatchVideo;
