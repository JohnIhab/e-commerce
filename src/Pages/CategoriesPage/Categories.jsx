import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BiCategory } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import CategoriesContextProvider, {
  CategoriesContext,
} from "../../context/CategoriesContext";
import { Link } from "react-router-dom";
import CategoryCard from "../../Components/CategoryCard";

const Categories = () => {
  const { categories } = useContext(CategoriesContext);
  useEffect(() => {
  }, [categories]);

  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{"JootBag | Categories"}</title>
        <meta name="description" content="JootBagShop" />
      </Helmet>

     <div className="py-20">
       <div className="flex justify-center py-5 mt-5">
        <h3 className="text-3xl font-bold flex items-center">
          <BiCategory size={30} className="mx-3" />
          {t('categories.Categories')}
        </h3>
      </div>
      <div className="py-10">
        <div className="flex gap-5 justify-center flex-wrap wrap-">
          {categories?.map((category) => (
            <CategoryCard
              c={category}
            />
          ))}
        </div>
      </div>
     </div>
    </>
  );
};

export default Categories;
