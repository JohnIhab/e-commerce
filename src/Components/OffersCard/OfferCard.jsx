import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BiSolidOffer } from "react-icons/bi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const OfferCard = ({ offer }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (!offer) return null;

  const title = lang === "en" ? offer.title_en : offer.title_ar ?? offer.title_en;
  const banner = lang === "en" ? offer.banner_en : offer.banner_ar ?? offer.banner_en;

  const slug = lang === "en" ? offer.slug_en : offer.slug_ar ?? offer.slug_en;
  const offerHref = `/offers/${slug}`;

  const products = offer.products || [];

  return (
    <div className="group relative rounded-2xl border border-gray-200/60 bg-white shadow-md  hover:border-primary/20 transition-all duration-500  overflow-hidden w-full  flex flex-col h-[30rem]">
      {/* Banner Section with Gradient Overlay */}
      <div className="relative overflow-hidden">
        <Link to={offerHref} className="block">
          <div className="w-full aspect-[16/12] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 relative">
            <img 
              src={banner} 
              alt={title} 
              className="w-full h-full object-fill group-hover:scale-110 transition-transform duration-700 ease-out" 
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </Link>

        {/* Enhanced Offer Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-gray-300 text-black/50 px-4 py-2 rounded-full shadow-lg  border border-white/20">
          <BiSolidOffer className="text-black/50 animate-pulse" size={18} />
          <span className="text-sm font-bold tracking-wide">{title}</span>
        </div>
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
      </div>

      {/* Enhanced Content Section */}
      <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/30">
        {/* Date badges */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`${lang === "ar" ? "text-right" : "text-left"} flex-1 space-y-1`}>
            {/* {offer.start_at && (
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {t('offer-card.Starts')} {offer.start_at.split(" ")[0]}
              </div>
            )} */}
            {offer.end_at && (
              <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {t('offer-card.Ends')} {offer.end_at.split(" ")[0]}
              </div>
            )}
          </div>
        </div>

        {/* Auto-scrolling single product carousel */}
        {offer.products && offer.products.length ? (
          <div className="relative flex-1">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              className="h-full"
              style={{
                '--swiper-pagination-color': 'var(--color-third, #3b82f6)',
                '--swiper-pagination-bullet-inactive-color': '#d1d5db',
                '--swiper-pagination-bullet-size': '8px',
                '--swiper-pagination-bullet-horizontal-gap': '4px',
              }}
            >
              {products.map((p) => {
              const prodImage = (lang === "en" ? p.banner_en : p.banner_ar ?? p.banner_en) || p.photos?.[0] || "";
              const prodTitle = lang === "en" ? p.title_en : p.title_ar ?? p.title_en;
              const detailsHref = `/details/${p.slug_en ?? ""}`;

              // Get price from converted price or fallback to unit_price
              const originalPrice = p?.converted?.converted_price ?? parseFloat(p.unit_price) ?? 0;
              const symbol =
                lang === "en" ? p?.converted?.symbol_en : p?.converted?.symbol_ar ?? p?.converted?.symbol_en;

              let discountedPrice = originalPrice;
              let hasDiscount = false;
              let discountPercent = 0;

              // Check for product-level discount first
              if (p.discount && parseFloat(p.discount) > 0) {
                if (p.discount_type === "percent") {
                  discountPercent = parseFloat(p.discount);
                  discountedPrice = +(originalPrice - originalPrice * (discountPercent / 100)).toFixed(2);
                  hasDiscount = true;
                } else if (p.discount_type === "amount") {
                  const discountAmount = parseFloat(p.discount);
                  discountedPrice = +(originalPrice - discountAmount).toFixed(2);
                  discountPercent = +((discountAmount / originalPrice) * 100).toFixed(0);
                  hasDiscount = true;
                }
              }

              // Check for offer-level actions (override product discount if exists)
              if (offer.actions && offer.actions.length) {
                offer.actions.forEach((act) => {
                  if (act.product_id == p.id) {
                    if (act.action_type === "discount_percent") {
                      discountPercent = act.value;
                      discountedPrice = +(originalPrice - originalPrice * (act.value / 100)).toFixed(2);
                      hasDiscount = true;
                    } else if (act.action_type === "discount_amount") {
                      const discountAmount = parseFloat(act.value);
                      discountedPrice = +(originalPrice - discountAmount).toFixed(2);
                      discountPercent = +((discountAmount / originalPrice) * 100).toFixed(0);
                      hasDiscount = true;
                    } else if (act.action_type === "free_product") {
                      discountedPrice = 0;
                      discountPercent = 100;
                      hasDiscount = true;
                    }
                  }
                });
              }

              return (
                <SwiperSlide key={p.id}>
                  <div className="relative group/product h-full">
                    <Link
                    to={detailsHref}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100">
                      {prodImage ? (
                        <img
                          src={prodImage}
                          alt={prodTitle}
                          className="w-full h-full object-fill group-hover/product:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {hasDiscount && discountPercent > 0 && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                          {discountPercent}%
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold line-clamp-3 text-slate-900 mb-2">{prodTitle}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {hasDiscount && (
                          <span className="text-xs text-gray-400 line-through font-medium">
                            {symbol} {originalPrice}
                          </span>
                        )}
                        <span
                          className={`text-base font-bold ${
                            hasDiscount && discountedPrice === 0 ? 'text-green-600' : 'text-primary'
                          }`}
                        >
                          {discountedPrice === 0 ? t('offer-card.Free') : `${symbol} ${discountedPrice}`}
                        </span>
                        {hasDiscount && discountedPrice > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 my-3.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {t('offer-card.Save')} {symbol} {(originalPrice - discountedPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`flex-shrink-0 text-gray-400 group-hover/product:translate-x-1 transition-all duration-300 ${lang === 'ar' ? 'rotate-180' : ''}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
              );
            })}
            </Swiper>
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 text-sm text-slate-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            {t('offer-card.No products')}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferCard;
