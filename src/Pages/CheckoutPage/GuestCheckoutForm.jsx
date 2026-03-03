import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckoutContext } from "../../context/CheckoutContext";
import { ApiAuthContext } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PiCircleNotch } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { Cart } from "../../context/GetCartContext";

const GuestCheckoutForm = () => {
  const {
    paymentMethod,
    setGuestInfo,
    setShowGuestModal,
    showGuestModal,
    setGuestData,
    guestInfo,
    placeOrder,
  } = useContext(CheckoutContext);
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { cart, setChanged } = useContext(Cart);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const { t, i18n } = useTranslation();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      country_id: "",
      state_id: "",
      city_id: "",
      address: "",
      phone: "",
      postal_code: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      address: Yup.string().required("Required"),
      country_id: Yup.string().required("Required"),
      state_id: Yup.string().required("Required"),
      city_id: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);

      placeOrder(values);

      // try {
      //   const tempId = localStorage.getItem("tempUserId");
      //   if (
      //     (!cart || !(cart.items && cart.items.length > 0)) &&
      //     !tempId &&
      //     !localStorage.getItem("token")
      //   ) {
      //     console.warn("Guest checkout blocked: cart empty and no tempUserId");
      //     toast.error("Cart is empty");
      //     setSubmitting(false);
      //     return;
      //   }

      //   const payload = {
      //     payment_method_id: isNaN(Number(paymentMethod))
      //       ? paymentMethod
      //       : Number(paymentMethod),
      //     name: values.name,
      //     email: values.email,
      //     address: {
      //       country_id: values.country_id || 1,
      //       state_id: values.state_id || 1,
      //       city_id: values.city_id || 1,
      //       address: values.address,
      //       phone: values.phone,
      //       postal_code: values.postal_code,
      //     },
      //   };

      //   // If there is no authenticated token, include temp user id header so backend can find guest cart
      //   const headers = {
      //     "X-API-KEY": XApiKey,
      //   };
      //   if (localStorage.getItem("token"))
      //     headers.Authorization = localStorage.getItem("token");
      //   else if (localStorage.getItem("tempUserId"))
      //     headers["X-Temp-User-Id"] = localStorage.getItem("tempUserId");

      //   const resopnse = await axios.post(`${baseUrl}/checkout`, payload, {
      //     headers,
      //   });
      //   if (resopnse.data.errors) {
      //     toast.error(resopnse.data.errors);
      //   } else {
      //     toast.success(resopnse.data.message);
      //     localStorage.removeItem("tempUserId");
      //     setChanged(Date.now());
      //     navigate("/invoice");
      //   }
      //   console.log(resopnse);

      //   setShowGuestModal(false);
      // } catch (err) {
      //   console.error(
      //     "Guest checkout error",
      //     err?.response || err?.message || err
      //   );
      //   toast.error(err?.response?.data?.message || "Failed to place order");
      // } finally {
      //   setSubmitting(false);
      // }
    },
  });

  // fetch countries
  async function getCountries() {
    const response = await axios.get(`${baseUrl}/countries`, {
      headers: { "X-API-KEY": XApiKey },
    });
    return response.data;
  }

  const { data: countriesData } = useQuery({
    queryKey: ["guest_countries"],
    queryFn: getCountries,
  });
  useEffect(() => {
    if (countriesData?.data) setCountries(countriesData.data);
  }, [countriesData]);

  async function getStates() {
    const response = await axios.get(`${baseUrl}/states/${selectedCountryId}`, {
      headers: { "X-API-KEY": XApiKey },
    });
    return response.data;
  }
  const { data: statesData } = useQuery({
    queryKey: ["guest_states", selectedCountryId],
    queryFn: getStates,
    enabled: !!selectedCountryId,
  });
  useEffect(() => {
    if (statesData?.data) setStates(statesData.data);
  }, [statesData]);

  async function getCities() {
    const response = await axios.get(`${baseUrl}/cities/${selectedStateId}`, {
      headers: { "X-API-KEY": XApiKey },
    });
    return response.data;
  }

  const { data: citiesData } = useQuery({
    queryKey: ["guest_cities", selectedStateId],
    queryFn: getCities,
    enabled: !!selectedStateId,
  });
  useEffect(() => {
    if (citiesData?.data) setCities(citiesData.data);
  }, [citiesData]);

  if (!showGuestModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setShowGuestModal(false)}
      />

      <div className="relative z-50 w-full max-w-3xl mx-4 p-5  ">
        <div className="no-scroll-bar bg-white rounded-lg shadow-2xl overflow-hidden  max-h-[600px] overflow-y-scroll lg:overflow-y-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-neutral-50 to-neutral-100">
            <h3 className="text-2xl font-semibold">
              {t("guestCheckout.Guest Checkout")}
            </h3>
            <button
              aria-label="Close"
              onClick={() => setShowGuestModal(false)}
              className="text-2xl p-2 rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>

          <div className="px-6 py-6">
            <form
              onSubmit={formik.handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("guestCheckout.Full name")}
                  </label>
                  <input
                    name="name"
                    placeholder="Ahmed Ali"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("guestCheckout.Email")}
                  </label>
                  <input
                    name="email"
                    placeholder="email@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  {t("guestCheckout.Full Address")}
                </label>
                <input
                  name="address"
                  placeholder="123 Nile Street, Cairo"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formik.touched.address && formik.errors.address ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.address}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("guestCheckout.Phone")}
                </label>
                <input
                  name="phone"
                  placeholder=" +2010..."
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("guestCheckout.PostCode")}
                </label>
                <input
                  name="postal_code"
                  placeholder="12345"
                  value={formik.values.postal_code}
                  onChange={formik.handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Country / State / City dropdowns */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("guestCheckout.Country")}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "country" ? null : "country"
                      )
                    }
                    className="w-full text-left border rounded px-3 py-2"
                  >
                    {selectedCountryName || t("guestCheckout.Select Country")}
                  </button>
                  {openDropdown === "country" && (
                    <ul className="absolute z-50 w-full bg-white border rounded shadow max-h-48 overflow-auto">
                      {countries.map((c) => {
                        const countryTitle =
                          i18n?.language === "ar" && c.title_ar
                            ? c.title_ar
                            : c.title_en;
                        return (
                          <li
                            key={c.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedCountryId(c.id);
                              setSelectedCountryName(countryTitle);
                              formik.setFieldValue("country_id", c.id);
                              setOpenDropdown(null);
                              setSelectedStateId("");
                              setSelectedStateName("");
                              setCities([]);
                            }}
                          >
                            {countryTitle}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                {formik.touched.country_id && formik.errors.country_id ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.country_id}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("guestCheckout.State")}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    disabled={!selectedCountryName}
                    onClick={() =>
                      setOpenDropdown(openDropdown === "state" ? null : "state")
                    }
                    className={`w-full text-left border rounded px-3 py-2 ${
                      !selectedCountryName
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {selectedStateName || t("guestCheckout.Select State")}
                  </button>
                  {openDropdown === "state" && selectedCountryName && (
                    <ul className="absolute z-50 w-full bg-white border rounded shadow max-h-48 overflow-auto">
                      {states.map((s) => {
                        const stateTitle =
                          i18n?.language === "ar" && s.title_ar
                            ? s.title_ar
                            : s.title_en;
                        return (
                          <li
                            key={s.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedStateId(s.id);
                              setSelectedStateName(stateTitle);
                              formik.setFieldValue("state_id", s.id);
                              setOpenDropdown(null);
                              setCities([]);
                            }}
                          >
                            {stateTitle}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                {formik.touched.state_id && formik.errors.state_id ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.state_id}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("guestCheckout.City")}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    disabled={!selectedStateName}
                    onClick={() =>
                      setOpenDropdown(openDropdown === "city" ? null : "city")
                    }
                    className={`w-full text-left border rounded px-3 py-2 ${
                      !selectedStateName ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  >
                    {selectedCity || t("guestCheckout.Select City")}
                  </button>
                  {openDropdown === "city" && selectedStateName && (
                    <ul className="absolute z-50 w-full bg-white border rounded shadow max-h-48 overflow-auto">
                      {cities.map((c) => {
                        const cityTitle =
                          i18n?.language === "ar" && c.title_ar
                            ? c.title_ar
                            : c.title_en;
                        return (
                          <li
                            key={c.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedCity(cityTitle);
                              formik.setFieldValue("city_id", c.id);
                              setOpenDropdown(null);
                            }}
                          >
                            {cityTitle}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                {formik.touched.city_id && formik.errors.city_id ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.city_id}
                  </div>
                ) : null}
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowGuestModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  {t("guestCheckout.Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded bg-third text-primary"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <PiCircleNotch className="animate-spin" />
                      {t("guestCheckout.Submitting...")}
                    </div>
                  ) : (
                    t("guestCheckout.Place Order")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCheckoutForm;
