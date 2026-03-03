// Full code with i18n added to static texts and no modifications to logic
// Translation files will be added below

import React, { useContext, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { BsFillPrinterFill } from "react-icons/bs";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../context/Settings";

const Invoice = ({ invoiceData }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (invoiceData) {
      setItems(invoiceData.items);
    }
  }, [invoiceData]);

  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });
  const { mainLogo, siteName_ar, siteName_en } = useContext(SettingsContext);
  
  return (
   <>
   {invoiceData? <>
      <Helmet>
        <title>
          {`${lang === "en" ? siteName_en : siteName_ar ?? siteName_en} | ` +
            t("invoice.title")}
        </title>
        <meta name="description" content="JootBagInvoice" />
      </Helmet>
      <div className="pt-15">
        <div className="py-5 mt-8 lg:w-[70%]   m-auto flex justify-end px-2">
          <button onClick={reactToPrintFn} className="">
            <BsFillPrinterFill className="text-third" size={30} />
          </button>
        </div>
        <div className="py-5 flex justify-center items-center ">
          <div className="shadow-sm rounded-lg p-5 lg:w-[70%]" ref={contentRef}>
            <div className="w-full flex justify-between items-center">
              <div className="flex flex-col items-center">
                <img
                  src={mainLogo}
                  className="h-10"
                  alt={
                    lang === "en"
                      ? `${siteName_en}`
                      : `${siteName_ar}` ?? `${siteName_en}`
                  }
                />
                <div>
                  <h3 className="font-bold">{t("invoice.thankYouShopping")}</h3>
                </div>
              </div>
              <div className="flex flex-col items-center ">
                <div className="text-2xl font-bold">{t("invoice.invoice")}</div>
                <div className="text-center">
                  {t("invoice.order")}
                  <span className="font-bold text-center">
                    {invoiceData?.order_code}
                  </span>
                </div>
                <div className="text-center">{invoiceData?.created_at}</div>
              </div>
            </div>

            <div className="overflow-x-auto ">
              <div className="overflow-x-auto py-5">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-md">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="lg:px-6 px-1 py-3 text-start text-sm font-semibold text-gray-700">
                        {t("invoice.items")}
                      </th>
                      <th className="lg:px-6 px-1 py-3 text-center text-sm font-semibold text-gray-700">
                        {t("invoice.price")}
                      </th>
                      <th className="lg:px-6 px-1 py-3 text-center text-sm font-semibold text-gray-700">
                        {t("invoice.quantity")}
                      </th>
                      <th className="lg:px-6 px-1 py-3 text-end text-sm font-semibold text-gray-700">
                        {t("invoice.subtotal")}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {items?.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="lg:px-6 px-1 py-4 text-sm text-third">
                          {lang === "en"
                            ? item.product.title_en
                            : item.product.title_ar ?? item.product.title_en}
                        </td>
                        <td className="lg:px-6 px-1 py-4 text-sm text-center text-gray-900">
                          {lang === "en"
                            ? item?.converted?.symbol_en
                            : item?.converted?.symbol_ar ??
                              item?.converted?.symbol_en}
                          {item?.converted?.converted_price?.price}
                        </td>
                        <td className="lg:px-6 px-1 py-4 text-sm text-center text-gray-900">
                          {item?.quantity}
                        </td>
                        <td className="lg:px-6 px-1 py-4 text-sm text-end text-gray-900">
                          {lang === "en"
                            ? item?.converted?.symbol_en
                            : item?.converted?.symbol_ar ??
                              item?.converted?.symbol_en}
                          {item?.converted?.converted_price?.price *
                            item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot className="bg-gray-100 border-gray-200 divide-y divide-gray-200 ">
                    <tr>
                      <th className="lg:px-6 px-1 py-3 text-start text-sm font-semibold text-gray-700">
                        {t("invoice.subtotal")}
                      </th>
                      <th className="lg:px-6 px-1 py-3 text-start text-sm font-semibold text-gray-700">
                        {t("invoice.shippingFees")}
                      </th>
                      <th className="lg:px-6 px-1 py-3 text-center text-sm font-semibold text-gray-700">
                        {t("invoice.totalDiscount")}
                      </th>
                      <th className="lg:px-6 px-1 py-3 text-end text-sm font-semibold text-gray-700">
                        {t("invoice.total")}
                      </th>
                      <th></th>
                    </tr>
                    <tr className="bg-white">
                      <td className="lg:px-6 px-1 py-4 text-sm text-start text-gray-900">
                        {lang === "en"
                          ? invoiceData?.converted?.symbol_en
                          : invoiceData?.converted?.symbol_ar ??
                            invoiceData?.converted?.symbol_en}
                        {invoiceData?.converted?.converted_price.total_price}
                      </td>
                      <td className="lg:px-6 px-1 py-4 text-sm text-center text-gray-900">
                        {lang === "en"
                          ? invoiceData?.converted?.symbol_en
                          : invoiceData?.converted?.symbol_ar ??
                            invoiceData?.converted?.symbol_en}
                        {invoiceData?.converted?.converted_price.total_shipping}
                      </td>
                      <td className="lg:px-6 px-1 py-4 text-sm text-center text-gray-900">
                        {lang === "en"
                          ? invoiceData?.converted?.symbol_en
                          : invoiceData?.converted?.symbol_ar ??
                            invoiceData?.converted?.symbol_en}
                        {invoiceData?.converted?.converted_price.total_discount}
                      </td>
                      <td className="lg:px-6 px-1 py-4 text-sm text-end font-bold text-gray-900  ">
                        {lang === "en"
                          ? invoiceData?.converted?.symbol_en
                          : invoiceData?.converted?.symbol_ar ??
                            invoiceData?.converted?.symbol_en}
                        {invoiceData?.converted?.converted_price.grand_total}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* User Details */}
              <div className="overflow-x-auto  py-4">
                <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <th className="lg:px-6 px-1 py-3 text-sm font-semibold bg-gray-100  text-gray-600 border-r border-gray-200 w-1/8 text-start">
                        {t("invoice.name")}
                      </th>
                      <td className="lg:px-6 px-1 py-3 text-sm text-gray-900 text-start">
                        {invoiceData?.user.name}
                      </td>
                    </tr>
                    <tr>
                      <th className="lg:px-6 px-1 py-3 text-sm font-semibold bg-gray-100 text-gray-600 border-r border-gray-200 text-start">
                        {t("invoice.address")}
                      </th>
                      <td className="lg:px-6 px-1 py-3 text-sm text-gray-900 text-start">
                        {invoiceData?.address.address}
                      </td>
                    </tr>
                    <tr>
                      <th className="lg:px-6 px-1 py-3 text-sm font-semibold bg-gray-100 text-gray-600 border-r border-gray-200 text-start">
                        {t("invoice.city")}
                      </th>
                      <td className="lg:px-6 px-1 py-3 text-sm text-gray-900 text-start">
                        {lang === "en"
                          ? invoiceData?.address.city.title_en
                          : invoiceData?.address.city.title_ar ??
                            invoiceData?.address.city.title_en}
                      </td>
                    </tr>
                    <tr>
                      <th className="lg:px-6 px-1 py-3 text-sm font-semibold bg-gray-100 text-gray-600 border-r border-gray-200 text-start">
                        {t("invoice.state")}
                      </th>
                      <td className="lg:px-6 px-1 py-3 text-sm text-gray-900 text-start">
                        {lang === "en"
                          ? invoiceData?.address.state.title_en
                          : invoiceData?.address.state.title_ar ??
                            invoiceData?.address.state.title_en}
                      </td>
                    </tr>
                    <tr>
                      <th className="lg:px-6 px-1 py-3 text-sm font-semibold bg-gray-100 text-gray-600 border-r border-gray-200 text-start">
                        {t("invoice.country")}
                      </th>
                      <td className="lg:px-6 px-1 py-3 text-sm text-gray-900 text-start">
                        {lang === "en"
                          ? invoiceData?.address.country.title_en
                          : invoiceData?.address.country.title_ar ??
                            invoiceData?.address.country.title_en}
                      </td>
                    </tr>
                    {invoiceData?.user.phone ? (
                      <tr>
                        <th className="lg:px-6 px-1 py-3 text-sm font-semibold bg-gray-100 text-gray-600 border-r border-gray-200 text-start">
                          {t("invoice.phone")}
                        </th>
                        <td className="lg:px-6 px-1 py-3 text-sm text-gray-900 text-start">
                          {invoiceData?.user.phone}
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <th className="lg:px-6 px-1 py-3 text-sm font-semibold bg-gray-100 text-gray-600 border-r border-gray-200 text-start">
                        {t("invoice.email")}
                      </th>
                      <td className="lg:px-6 px-1 py-3 text-sm text-gray-900 text-start">
                        {invoiceData?.user.email}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-gray-100 text-base lg:w-5/12 w-10/12 m-auto mt-2 rounded-md flex justify-center py-3">
              <p className="text-bold ">{t("invoice.thankYouOrder")}</p>
            </div>
          </div>
        </div>
      </div>
    </>:null

   }
   </>
  );
};

export default Invoice;
