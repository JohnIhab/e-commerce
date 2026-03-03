import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/Loader";
import { ApiAuthContext } from "../../context/AuthContext";
import { TbRosette } from "react-icons/tb";
import { FaClock, FaPercentage } from "react-icons/fa";
import CountDownTimer from "../../Components/CountDownTimer";

const OfferDetails = () => {
    const { slug } = useParams();
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const [products, setProducts] = useState([]);
    const [offerData, setOfferData] = useState(null);
    const { baseUrl, XApiKey } = useContext(ApiAuthContext);

    async function getOfferBySlug() {
        const response = await axios.get(`${baseUrl}/offers/${slug}`, {
            headers: {
                "X-API-KEY": XApiKey,
            },
        });
        return response.data.data;
    }

    let { data, isError, error, isLoading, isFetching } = useQuery({
        queryKey: ["OfferBySlug", slug],
        queryFn: getOfferBySlug,
        enabled: !!slug,
    });

    useEffect(() => {
        if (data) {
            setProducts(data.products || []);
            setOfferData(data);
        }
    }, [data]);

    if (isLoading) return <Loader />;

    if (!offerData) {
        return (
            <div className="py-16 text-center text-slate-600">{t('offers-page.no offer')}</div>
        );
    }

    const title = lang === "en" ? offerData.title_en : offerData.title_ar ?? offerData.title_en;
    const banner = lang === "en" ? offerData.banner_en : offerData.banner_ar ?? offerData.banner_en;

    return (
        <>
          <div className="pt-30">
              <div className="bg-[#07332f] py-20 text-white relative overflow-hidden aspect-[50/12] flex items-center justify-center">
                <img src={banner} alt={title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="relative z-10 flex text-shadow-lg items-center justify-center text-4xl md:text-6xl font-bold gap-3 backdrop-blur-md shadow-sm bg-[#3f181889] p-2 rounded-xl w-full mx-5 ">
                    <div className="relative flex">
                        <TbRosette className="animate-spin" style={{ animationDuration: "3s" }} />
                        <FaPercentage className="absolute inset-4.5" size={25} />
                    </div>

                    <p className="">{title}</p>

                    <div className="relative flex">
                        <TbRosette className="animate-spin" style={{ animationDuration: "3s" }} />
                        <FaPercentage className="absolute inset-4.5" size={25} />
                    </div>
                </div>
            </div>

            {offerData.end_at && (
                <div className="flex justify-center items-center gap-2 z-[9000] bg-secondary text-2xl mt-4 mx-4 rounded-2xl !text-white p-2">
                    <FaClock size={30} className="text-primary" />
                    <CountDownTimer targetDate={offerData.end_at} />
                </div>
            )}
            <div className="p-6 max-w-4xl">
                <h2 className="text-2xl font-semibold mb-3">{t('offers-page.description')}</h2>
                <div
                    className="prose max-w-none text-slate-700"
                    dangerouslySetInnerHTML={{ __html: lang === 'en' ? (offerData.description_en || '') : (offerData.description_ar || '') }}
                />
            </div>
            <div className="flex flex-wrap py-8 space-y-5">
                {products.map((p) => (
                    <div key={p.id} className="lg:w-4/12 w-full flex justify-center">
                        <div className="w-4/6">
                            <ProductCard product={p} />
                        </div>
                    </div>
                ))}
            </div>
          </div>

            
        </>
    );
};

export default OfferDetails;
