import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Cart } from "../../context/GetCartContext";

const Order = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { items, bundles, cart } = useContext(Cart);

  function calculateDiscount(product) {
    const originalPrice = product?.converted?.converted_price;
    const discountType = product?.discount_type;
    const discountValue = product?.discount;
    const discountEnd = product?.discount_end_date
      ? new Date(product.discount_end_date)
      : null;

    const now = new Date();

    if (
      !discountType ||
      discountValue == 0 ||
      (discountEnd && discountEnd < now)
    ) {
      return {
        price: originalPrice,
        hasDiscount: false,
      };
    }

    let discountedPrice = originalPrice;
    if (discountType === "fixed") {
      discountedPrice = originalPrice - discountValue;
    } else if (discountType === "percent") {
      discountedPrice = originalPrice - originalPrice * (discountValue / 100);
    }

    return {
      price: discountedPrice,
      hasDiscount: true,
    };
  }

  return (
    <div className="py-5">
      <h3 className="text-2xl font-bold w-full text-start mt-3">
        {t("guestCheckout.Your Order")}
      </h3>

      {/* Cart items */}
      {items?.map((item) => (
        <div
          key={item.id}
          className="flex border-2 my-2 border-[#b5bfd9] p-3 rounded-lg"
        >
          <div>
            <div className="flex items-center gap-10 rounded-lg mb-4">
              <div className="w-[50px] h-[50px] flex items-center relative">
                <img
                  src={
                    lang === "en"
                      ? item.product.banner_en
                      : item.product.banner_ar ?? item.product.banner_en
                  }
                  className="m-2"
                  alt=""
                />
                <div className="absolute rounded-full p-1 bg-[#aca8a836] backdrop-blur-md top-0 start-10 font-bold text-xs">
                  X{item.quantity}
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-md">
                  {lang === "en"
                    ? item.product.title_en
                    : item.product.title_ar ?? item.product.title_en}
                </h3>
                <p className="text-sm">
                  {(lang === "en"
                    ? item.product.title_en
                    : item.product.title_ar ?? item.product.title_en
                  ).slice(0, 45)}
                  ...
                </p>
                <p className="text-sm">
                  {(() => {
                    const result = calculateDiscount(item.product);
                    const symbol =
                      lang === "en"
                        ? item.product?.converted.symbol_en
                        : item.product?.converted.symbol_ar ??
                          item.product?.converted.symbol_en;
                    return (
                      <>
                        {result.hasDiscount && (
                          <span className="text-xs text-gray-500 line-through">
                            {symbol}
                            {item.product?.converted?.converted_price}
                          </span>
                        )}
                        <span className="text-sm font-semibold">
                          {symbol} {result.price}
                        </span>
                      </>
                    );
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Bundle offers (if any) */}
      {bundles?.map((b) => (
        <div
          key={b.id || b.bundle_offer?.id}
          className="flex border-2 my-2 border-[#b5bfd9] p-3 rounded-lg"
        >
          <div>
            <div className="flex items-center gap-10 rounded-lg mb-4">
              <div className="w-[50px] h-[50px] flex items-center relative">
                <img
                  src={
                    lang === "en"
                      ? b.bundle_offer.banner_en
                      : b.bundle_offer.banner_ar ?? b.bundle_offer.banner_en
                  }
                  className="m-2"
                  alt=""
                />
                <div className="absolute rounded-full p-1 bg-[#aca8a836] backdrop-blur-md top-0 start-10 font-bold text-xs">
                  X{b.quantity ?? 1}
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-md">
                  {lang === "en"
                    ? b.bundle_offer.title_en
                    : b.bundle_offer.title_ar ?? b.bundle_offer.title_en}
                </h3>
                <p className="text-sm">
                  {lang === "en"
                    ? b.bundle_offer.title_en
                    : b.bundle_offer.title_ar ?? b.bundle_offer.title_en}
                </p>
                <p className="text-sm">
                  <span className="text-sm font-semibold">
                    {lang === "en"
                      ? b.bundle_offer.converted?.symbol_en
                      : b.bundle_offer.converted?.symbol_ar ??
                        b.bundle_offer.converted?.symbol_en}{" "}
                    {b.bundle_offer.converted?.converted_balance}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Order;
