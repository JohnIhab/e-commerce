import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiAuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/Loader";
import { Helmet } from "react-helmet";
import ProductCard from "../../Components/ProductCard/ProductCard";
import axios from "axios";
import { FiTag } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const NewArrivalPage = () => {
  const { page } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [items, setItems] = useState([]);
  const [allPages, setAllPages] = useState();
  const [toPage, setToPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (page) {
      setToPage(page);
    } else {
      setToPage(1);
    }
  }, []);

  async function getNewArriavlPage() {
    const response = await axios.get(
      `${baseUrl}/products/new-arrival?page=${toPage}`,
      {
        headers: {
          "X-API-KEY": XApiKey,
        },
      }
    );
    return response.data.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["NewArriavlPage", toPage],
    queryFn: getNewArriavlPage,
  });

  useEffect(() => {
    if (data) {
       
      setItems(data.products.data);
      setAllPages(data.products.last_page);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Helmet>
        <title>{"JootBag | New Arrival"}</title>
      </Helmet>
      <div className="py-30">
        <div className="flex justify-center py-5">
          <h3 className="text-3xl font-bold flex items-center">
            <FiTag size={30} className="mx-3" /> {t('New Arrival.title')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-5">
          {items.map((p) => (
            <>
              <ProductCard key={p.id} product={p} />
            </>
          ))}
          {/* Pagenation */}
        </div>
        <div className="flex justify-center w-full   items-center gap-3 mt-8 mb-20">
          <button
            className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-50"
             onClick={() => {
              const prevPage = Math.max(1, page - 1);
              setToPage(prevPage);
              navigate(`/new-arrival/${prevPage}`);
            }}
            disabled={toPage <= 1 || isLoading}
          >
            {t('best-sellers.Prev')}
          </button>
          <span className="text-sm text-gray-600">
            {t('best-sellers.Page')} {toPage} {t('best-sellers.of')} {allPages}
          </span>
          <button
            className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-50"
            onClick={() => {
              const nextPage = Math.min(allPages, toPage + 1);
              setToPage(nextPage);
              navigate(`/new-arrival/${nextPage}`);
            }}
            disabled={toPage >= allPages || isLoading}
          >
            {t('best-sellers.Next')}
          </button>
        </div>
      </div>
    </>
  );
};

export default NewArrivalPage;
