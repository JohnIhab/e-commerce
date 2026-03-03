import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const CategoryCard = ({ c }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  return (
    <>
      <Link
        to={`/categories/${lang === "en" ? c.slug_en : c.slug_ar ?? c.slug_en}`}
        className="flex flex-col bg-gradient-to-b   items-center gap-5    "
      >
        <div
          className={` w-80  h-90  mx-4 rounded-lg shadow-secondary shadow-lg relative bg-[url('${
            lang === "en" ? c.banner_en : c.banner_ar ?? c.banner_en
          }')]  bg-cover bg-no-repeat bg-center`}
          style={{
            backgroundImage: `url('${
              lang === "en" ? c.banner_en : c.banner_ar ?? c.banner_en
            }')`,
          }}
        >
          <div className="text-center text-sm font-bold w-full p-2">
            <span className="absolute bottom-4 left-4 bg-black/35 backdrop-blur-2xl text-white lg:text-xl px-6 py-2 rounded-md">
              {lang === "en" ? c.title_en : c.title_ar ?? c.title_en}
            </span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default CategoryCard;
