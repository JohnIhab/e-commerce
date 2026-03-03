import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Cart } from "../../context/GetCartContext";

const Summary = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const { cart, isLoading } = useContext(Cart);

  const converted = cart?.converted || {};
  const priceData = converted.converted_price || {};

  const subtotal = Number(priceData.total_price) || 0;
  const shipping = Number(priceData.total_shipping) || 0;
  const discount = Number(priceData.total_discount) || 0;
  const total = Number(priceData.total_price_after_discount ?? subtotal) || 0;

  const symbolEn = converted.symbol_en || "";
  const symbolAr = converted.symbol_ar || symbolEn;
  const symbol = lang === "en" ? symbolEn : symbolAr;

  const renderCurrency = (value) => {
    const num = Number(value) || 0;
    try {
      const formatted = new Intl.NumberFormat(lang === "en" ? "en-US" : "ar-EG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);

      return lang === "en" ? `${symbol}${formatted}` : `${formatted} ${symbol}`;
    } catch (e) {
      return `${symbol}${num.toFixed(2)}`;
    }
  };

  const discountPercent = useMemo(() => {
    if (subtotal <= 0) return 0;
    return Math.round((discount / subtotal) * 100);
  }, [discount, subtotal]);

  if (isLoading) {
    return (
      <section aria-live="polite" className="py-5">
        <h3 className="text-2xl font-bold mb-3">{t("guestCheckout.Order Summary")}</h3>
        <div className="rounded-lg shadow-md border border-[#e6e9f0] p-5">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (!converted || !converted.converted_price) {
    return <div className="py-5">{t("guestCheckout.No summary available")}</div>;
  }

  return (
    <section className="py-5" aria-labelledby="checkout-summary">
      <h3 id="checkout-summary" className="text-2xl font-bold mb-3">
        {t("guestCheckout.Order Summary")}
      </h3>

      <div className="rounded-lg shadow-md border border-[#e6e9f0] p-5 bg-white">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-gray-700">{t("guestCheckout.SubTotal")}</p>
            <p className="text-base font-semibold text-gray-900">{renderCurrency(subtotal)}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-gray-700">{t("guestCheckout.Shipping Fees")}</p>
            <p className="text-base font-semibold text-gray-900">{renderCurrency(shipping)}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-gray-700">
              {t("guestCheckout.Discount")} {" "}
              <span className="text-sm text-gray-500 italic">({discountPercent}%)</span>
            </p>
            <p className="text-base font-semibold text-gray-900">-{renderCurrency(discount)}</p>
          </div>

          <div className="border-t pt-4 flex items-center justify-between">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">{t("guestCheckout.Total")}</p>
              <span className="px-3 font-normal text-sm text-gray-500">{t("guestCheckout.incl. Vat")}</span>
            </div>
          <p className="text-lg font-bold text-gray-900">{renderCurrency(total)}</p>

      </div>


    </div>
      </div >
    </section >
  );
};

export default Summary;
