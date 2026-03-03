import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiAuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/Loader";
import { Helmet } from "react-helmet";
import OfferCard from "../../Components/OffersCard/OfferCard";
import axios from "axios";
import { FiTag } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { BiSolidOffer } from "react-icons/bi";

const OffersPage = () => {
    const { page } = useParams();
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { baseUrl, XApiKey } = useContext(ApiAuthContext);
    const [items, setItems] = useState([]);
    const [allPages, setAllPages] = useState(1);
    const [toPage, setToPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const p = parseInt(page || "1", 10);
        setToPage(Number.isNaN(p) ? 1 : p);
    }, [page]);

    // Fetch offers with pagination support
    async function getOffersList() {
        const response = await axios.get(`${baseUrl}/offers?search=&type=&page=${toPage}`, {
            headers: {
                "X-API-KEY": XApiKey,
            },
        });
        return response.data.data;
    }

    let { data, isError, error, isLoading, isFetching } = useQuery({
        queryKey: ["OffersPage", toPage],
        queryFn: getOffersList,
        keepPreviousData: true,
    });

    useEffect(() => {
        if (data) {
            if (data.offers && Array.isArray(data.offers.data)) {
                setItems(data.offers.data);
                setAllPages(data.offers.last_page ?? 1);
            } else if (Array.isArray(data.offers)) {
                setItems(data.offers);
                setAllPages(1);
            } else if (Array.isArray(data)) {
                setItems(data);
                setAllPages(1);
            } else {
                const offersArray = data?.offers_list ?? data?.items ?? [];
                setItems(Array.isArray(offersArray) ? offersArray : []);
                setAllPages(1);
            }
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
                        <BiSolidOffer size={35} className="mx-3" /> {t('offers-page.title')}
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-5">
                    {items.map((offer) => (
                        <div key={offer.id} className="w-full">
                            <OfferCard offer={offer} />
                        </div>
                    ))}
                </div>

                {/* If no offers, show a friendly message */}
                {!isLoading && items.length === 0 && (
                    <div className="text-center text-slate-500 py-10">{t('offers-page.no offer')}</div>
                )}

                {/* Pagination controls */}
                <div className="flex justify-center w-full items-center gap-3 mt-8 mb-20">
                    <button
                        className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-50"
                        onClick={() => {
                            const prevPage = Math.max(1, toPage - 1);
                            setToPage(prevPage);
                            navigate(`/offers/page/${prevPage}`);
                        }}
                        disabled={toPage <= 1 || isLoading}
                    >
                        {t('offers-page.prev')}
                    </button>

                    <span className="text-sm text-gray-600">
                        {t('offers-page.page')} {toPage} {t('offers-page.of')} {allPages}
                    </span>

                    <button
                        className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-50"
                        onClick={() => {
                            const nextPage = Math.min(allPages, toPage + 1);
                            setToPage(nextPage);
                            navigate(`/offers/page/${nextPage}`);
                        }}
                        disabled={toPage >= allPages || isLoading}
                    >
                        {t('offers-page.next')}
                    </button>
                </div>
            </div>
        </>
    );
};

export default OffersPage;
