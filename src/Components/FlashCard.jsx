import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import he from "he";
function DecodedText({ text }) {
  const safeText = typeof text === "string" ? text : "";
  const decodedHtml = he.decode(safeText);
  return <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />;
}
const FlashCard = ({ img, title, description, slug }) => {
  const { t } = useTranslation();
  const MotionLink = motion(Link);
  const MotionDiv = motion.div;

  return (
    <MotionLink
      to={`/details/${slug}`}
      className="w-full max-w-md sm:max-w-3xl lg:max-w-[80rem] mx-auto relative flex flex-col lg:flex-row items-center justify-center bg-transparent rounded-2xl overflow-hidden px-4 py-6 sm:px-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Left: Image */}
      <div className="w-full lg:w-2/3 h-[220px] md:h-[300px] lg:h-[500px] overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover object-center block"
        />
      </div>

      {/* Right: Info card */}
      <div
        className="w-full lg:w-5/12 bg-white p-6 md:p-10 flex flex-col justify-center h-auto lg:h-full text-center lg:text-left
        rtl:lg:text-right lg:-translate-x-10 rtl:lg:translate-x-10"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-4">
          {title}
        </h2>
        <div className="flex gap-1">
          <p className="text-third mb-6 leading-relaxed truncate w-full">
            <DecodedText text={description} />{" "}
          </p>
          <span>...</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Use a motion div (not a Link) to avoid nested links; outer Link makes whole card clickable */}
          <MotionDiv
            whileHover={{ scale: 1.02 }}
            className="bg-[#20322b] text-white text-sm font-medium px-4 py-2 rounded shadow-sm hover:brightness-95 cursor-pointer mx-auto lg:mx-0"
          >
            {t("featured-flash.View deal")}
          </MotionDiv>
        </div>
      </div>
    </MotionLink>
  );
};

export default FlashCard;
