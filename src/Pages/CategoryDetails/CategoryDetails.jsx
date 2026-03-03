import React, { useContext, useEffect, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { ApiAuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { FaFilter } from "react-icons/fa6";
import { t } from "i18next";

const CategoryDetails = () => {
  const { slug } = useParams();
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [category, setCategory] = useState({});
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [products, setProducts] = useState([]);
  const [clearRadio, setClearRadio] = useState(false);
  const [filter, setFilter] = useState(false);

  const { i18n } = useTranslation();
  const lang = i18n.language;

  async function getCategoryDetials() {
    const response = await axios.get(`${baseUrl}/products/category/${slug}`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return response.data.data;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getCategoryDetials", selectedBrand, slug],
    queryFn: getCategoryDetials,
    enabled: !selectedBrand,
  });
  useEffect(() => {
    if (data) {
      setCategory(data.category);
      setProducts(data.products.data);
    }
  }, [data]);
  async function getBrandsByCategorySlug() {
    const response = await axios.get(
      `${baseUrl}/product-category-brands/category/${slug}`,
      {
        headers: {
          "X-API-KEY": XApiKey,
        },
      }
    );
    return response.data.data;
  }

  const {
    data: brandsData,
    isLoading: brandsIsLoading,
    isError: BrandsIsError,
  } = useQuery({
    queryKey: ["getBrandsByCategorySlug"],
    queryFn: getBrandsByCategorySlug,
  });
  useEffect(() => {
    if (brandsData) {
      setBrands(brandsData.brands.data);
    }
  }, [brandsData]);
  async function getProductsBySelectedBrand() {
    const response = await axios.get(
      `${baseUrl}/products/brand/${selectedBrand}`,
      {
        headers: {
          "X-API-KEY": XApiKey,
        },
      }
    );
    return response.data.data;
  }

  const {
    data: selectedBrandData,
    isLoading: selectedBrandIsLoading,
    isError: selectedBrandIsError,
  } = useQuery({
    queryKey: ["productsByBrand", selectedBrand],
    queryFn: getProductsBySelectedBrand,
    enabled: !!selectedBrand,
  });
  useEffect(() => {
    if (selectedBrandData) {
      setProducts(selectedBrandData.products.data);
    }
  }, [selectedBrandData]);

  return (
    <>
      <Helmet>
        <title>{`JootBag | ${slug}`}</title>
        <meta name="description" content="JootBagShop" />
      </Helmet>
      <div className="flex w-full   py-25">
    {brands && brands.length > 0 ? 
        <div
          className={`lg:!w-[350px] lg:block   fixed z-[99] bg-primary h-[100vh] transition-all duration-1000 lg:static shadow-sm ${
            filter ? "left-0" : "-left-[80%]"
          }`}
        >
          <div className="flex justify-center py-5">
            <h3 className="text-3xl font-bold flex items-center">
              <BiCategory size={30} className="mx-3" />
              {t("brands.title")}
            </h3>
          </div>
          <div className="flex flex-col mx-4">
            <div className="w-[300px] px-4 py-3 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] flex flex-col gap-3 rounded-md  ">
              {brands?.map((brand) => (
                <label
                  htmlFor={brand.slug_en}
                  name="status"
                  dir="ltr"
                  className="font-medium h-20 relative cursor-pointer hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg has-[:checked]:text-primary has-[:checked]:bg-secondary   select-none"
                >
                  <div className="  fill-blue-500">
                    <img
                      src={
                        lang === "en"
                          ? brand.banner_en
                          : brand.banner_ar ?? brand.banner_en
                      }
                      className="w-20 h-20"
                      alt=""
                    />
                  </div>
                  <p className="font-bold">
                    {lang === "en"
                      ? brand.title_en
                      : brand.title_ar ?? brand.title_en}
                  </p>
                  <input
                    onChange={() => {
                      setSelectedBrand(brand.slug_en);
                      setClearRadio(false);
                      setFilter(false);
                    }}
                    checked={selectedBrand === brand.slug_en}
                    type="radio"
                    name="status"
                    className="peer/html w-4 h-4 absolute accent-current right-3"
                    id={brand.slug_en}
                  />
                </label>
              ))}
              <button
                onClick={() => {
                  setSelectedBrand(null);
                  setFilter(false);
                }}
                className="w-full bg-red-900 p-1 rounded-lg text-white"
              >
                {t("brands.clear")}
              </button>
            </div>
          </div>
        </div>:null

    }
        <div className={`w-full  mb-10 ${brands && brands.length>0 ? "lg:w-10/12":""}`}>
          <div className="flex justify-center py-5">
            <h3 className="text-3xl font-bold flex items-center">
              <BiCategory size={30} className="mx-3" />
              {lang === "en"
                ? category.title_en
                : category.title_ar ?? category.title_en}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-5">
            {products?.map((product) => (
              <ProductCard product={product} />
            ))}
          </div>
        </div>
        <div
          onClick={() => {
            setFilter(!filter);
          }}
          className="bg-secondary lg:hidden cursor-pointer z-[999] text-white fixed flex items-center justify-center w-[50px] h-[50px] rounded-full top-[91%]   end-3"
        >
          <FaFilter size={20} />
        </div>
      </div>
    </>
  );
};

export default CategoryDetails;
