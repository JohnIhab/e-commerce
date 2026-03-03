import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { ApiAuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styled from "styled-components";
import { PiCircleNotch } from "react-icons/pi";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { AddressContext } from "../context/AddressContext";
import { useTranslation } from "react-i18next";

const AddAddressModal = () => {
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [showModal, setShowModal] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const [isBot, setIsBot] = useState(false);
  const [ErrMsg, setErrMsg] = useState("");
  const [isFromLoading, setIsFormLoading] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);
  // const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const antiBotRef = useRef();
  const reCapcthaInput = useRef();
  const reCapcthaNum1 = useRef();
  const reCapcthaNum2 = useRef();
  const [num1, setNum1] = useState(() => Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState(() => Math.floor(Math.random() * 10));
  const { setAddressChanged, setIsSentC } = useContext(AddressContext);

  const { t } = useTranslation();

  async function handleAddAddress(values) {
    if (antiBotRef.current.value !== "") {
      setIsErr(true);
      setIsBot(true);
      setErrMsg("Bot Detected , Form Submition Blocked");

      return;
    }
    if (reCapcthaInput.current.value != num1 + num2) {
      setIsErr(true);
      setErrMsg("Recaptcha is not invalid");
      return;
    }

    setIsFormLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/auth/address`, values, {
        headers: {
          "X-API-KEY": XApiKey,
          Authorization: localStorage.getItem("token"),
        },
      });
      setIsSent(true);
      setIsSentC(true);
      toast.success(data?.message || "Address Added Successfully", {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "500",
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
      } else if (error.request) {
        console.error("No Response:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    } finally {
      setIsFormLoading(false);
      setAddressChanged(Date.now());
    }
  }

  let validation = Yup.object().shape({
    country_id: Yup.string().required("State is required"),
    state_id: Yup.string().required("State is required"),
    city_id: Yup.string().required("State is required"),
  });
  let addFormik = useFormik({
    initialValues: {
      address: "",
      country_id: "",
      state_id: "",
      city_id: "",
      phone: "",
      longitude: "",
      latitude: "",
      postal_code: "",
      set_default: 0,
    },
    onSubmit: handleAddAddress,
    validationSchema: validation,
  });

  const [countries, setCountries] = useState();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  async function getContries() {
    const response = await axios.get(`${baseUrl}/countries`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return response.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["countries"],
    queryFn: getContries,
  });

  useEffect(() => {
    if (data) {
      setCountries(data.data);
    }
  }, [data]);

  async function getStates() {
    const response = await axios.get(`${baseUrl}/states/${selectedCountryId}`, {
      headers: { "X-API-KEY": XApiKey },
    });
    return response.data;
  }

  const { data: statesData } = useQuery({
    queryKey: ["states", selectedCountryId],
    queryFn: getStates,
    enabled: !!selectedCountryId,
  });
  useEffect(() => {
    if (statesData) {
      setStates(statesData.data);
    }
  }, [statesData]);
  async function getcities() {
    const response = await axios.get(`${baseUrl}/cities/${selectedStateId}`, {
      headers: { "X-API-KEY": XApiKey },
    });
    return response.data;
  }

  const { data: citiesData } = useQuery({
    queryKey: ["cities", selectedStateId],
    queryFn: getcities,
    enabled: !!selectedStateId,
  });
  useEffect(() => {
    if (citiesData?.data) {
      setCities(citiesData.data);
    }
  }, [citiesData]);
  const StyledWrapper = styled.div`
    #checkbox {
      display: none;
    }

    .switch {
      position: relative;
      // width: fit-content;
      padding: 10px 20px;
      background-color: rgb(46, 46, 46);
      // border-radius: 50px;
      z-index: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: white;
      font-size: 0.9em;
      font-weight: 600;
      transition: all 0.3s;
    }
    .switch svg path {
      fill: white;
    }
    #checkbox:checked + .switch {
      background-color: #9e9e9e;
      box-shadow: 0px 0px 40px #9e9e9e;
      color: black;
    }
  `;
  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex p-2 justify-center"
    >
      <motion.div
        key="modal-content"
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="bg-white rounded-lg shadow-lg w-full max-w-lg relative"
        style={{ minWidth: 350 }}
        onClick={(e) => e.stopPropagation()}
      >
        {isFromLoading ? (
          <div className="backdrop-blur-sm absolute z-[99999] inset-0 flex items-center justify-center rounded-tr-lg rounded-tl-lg">
            <PiCircleNotch className="  text-6xl animate-spin" />
          </div>
        ) : null}
        {isErr && !isBot ? (
          <div className="backdrop-blur-sm absolute z-[99999] inset-0 flex items-center justify-center rounded-tr-lg rounded-tl-lg">
            <div className="flex flex-col">
              <p className="!text-[#18E200] text-3xl font-bold">{ErrMsg}</p>
              <button
                onClick={() => {
                  setIsErr(false);
                }}
              >
                {t("guestCheckout.Try Again")}
              </button>
            </div>
          </div>
        ) : null}
        {isBot ? (
          <div className="backdrop-blur-sm absolute z-[99999] inset-0 flex items-center justify-center rounded-tr-lg rounded-tl-lg">
            <div className="flex flex-col">
              <p className="!text-[#600000] text-center text-3xl font-bold">
                {ErrMsg}
              </p>
            </div>
          </div>
        ) : null}
        {isSent ? (
          <div className="backdrop-blur-sm absolute z-[99999] inset-0 flex items-center justify-center rounded-tr-lg rounded-tl-lg">
            <p className="!text-[#18E200] text-3xl font-bold">
              {t("guestCheckout.Address Added Successfully")}
            </p>
          </div>
        ) : null}

        <div className="flex w-full items-center py-4   bg-third  text-primary rounded-tr-lg rounded-tl-lg relative">
          <div className="w-full  text-2xl font-medium text-center">
            {t("guestCheckout.Add Address")}
          </div>

          <button
            className="absolute top-4 right-4 text-4xl hover:scale-110 transition-transform duration-200"
            onClick={() => setShowModal(false)}
            aria-label="Close"
          >
            <i className="fa-solid fa-x text-white"></i>
          </button>
        </div>

        <div className="aspect-[3/3] flex w-full items-center justify-center">
          {!isSent && !isErr && !isBot ? (
            <form
              className="px-12 py-6 flex flex-col gap-3 w-full"
              onSubmit={addFormik.handleSubmit}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Full Address */}
              <label className="flex flex-col gap-1 font-medium">
                {t("guestCheckout.Full Address")}*
                <input
                  type="text"
                  name="address"
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={addFormik.values.address}
                  onChange={addFormik.handleChange}
                  required
                />
              </label>

              {/* Dropdowns */}
              <div className="flex flex-col gap-2">
                {/* Country */}
                <div className="relative">
                  {t("guestCheckout.Country")}*
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(
                        openDropdown === "country" ? null : "country"
                      );
                    }}
                    className="border w-full rounded px-3 py-2 text-left focus:ring-2 focus:ring-primary"
                  >
                    {selectedCountryName || "Select Country"}
                  </button>
                  {openDropdown === "country" && (
                    <ul className="absolute z-50 w-full bg-white border rounded shadow-lg mt-1">
                      {countries.map((country) => (
                        <li
                          key={country.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedCountryId(country.id);
                            setSelectedCountryName(country.title_en);
                            addFormik.setFieldValue("country_id", country.id);

                            setSelectedState("");
                            setSelectedCity("");
                            setOpenDropdown(null);
                          }}
                        >
                          {country.title_en}
                        </li>
                      ))}
                    </ul>
                  )}
                  {addFormik.touched.country_id &&
                    addFormik.errors.country_id && (
                      <p className="text-red-500 text-sm mt-1">
                        {addFormik.errors.country_id}
                      </p>
                    )}
                </div>

                {/* State */}
                <div className="relative">
                  {t("guestCheckout.State")}*
                  <button
                    type="button"
                    disabled={!selectedCountryName}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(
                        openDropdown === "state" ? null : "state"
                      );
                    }}
                    className={`border w-full rounded px-3 py-2 text-left focus:ring-2 focus:ring-primary ${
                      !selectedCountryName
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {selectedStateName || "Select State"}
                  </button>
                  {openDropdown === "state" && selectedCountryName && (
                    <ul className="absolute z-50 w-full bg-white border rounded shadow-lg mt-1">
                      {states.map((state) => (
                        <li
                          key={state.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedStateName(state.title_en);
                            addFormik.setFieldValue("state_id", state.id);

                            setSelectedStateId(state.id);
                            setSelectedCity("");
                            setOpenDropdown(null);
                          }}
                        >
                          {state.title_en}
                        </li>
                      ))}
                    </ul>
                  )}
                  {addFormik.touched.state_id && addFormik.errors.state_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {addFormik.errors.state_id}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="relative">
                  {t("guestCheckout.City")}*
                  <button
                    type="button"
                    disabled={!selectedStateName}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === "city" ? null : "city");
                    }}
                    className={`border w-full rounded px-3 py-2 text-left focus:ring-2 focus:ring-primary ${
                      !selectedStateName ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  >
                    {selectedCity || "Select City"}
                  </button>
                  {openDropdown === "city" && selectedStateName && (
                    <ul className="absolute z-50 w-full bg-white border rounded shadow-lg mt-1">
                      {cities?.map((city) => (
                        <li
                          key={city.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            addFormik.setFieldValue("city_id", city.id);
                            setSelectedCity(city.title_en);
                            setOpenDropdown(null);
                          }}
                        >
                          {city.title_en}
                        </li>
                      ))}
                    </ul>
                  )}
                  {addFormik.touched.city_id && addFormik.errors.city_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {addFormik.errors.city_id}
                    </p>
                  )}
                </div>
              </div>
              <label className="flex flex-col gap-1 font-medium">
                {t("guestCheckout.Phone")}*
                <input
                  type="text"
                  name="phone"
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={addFormik.values.phone}
                  onChange={addFormik.handleChange}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 font-medium">
                {t("guestCheckout.PostCode")}*
                <input
                  type="text"
                  name="PostCode"
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={addFormik.values.PostCode}
                  onChange={addFormik.handleChange}
                  required
                />
              </label>

              <label className=" gap-1 font-medium hidden ">
                <input
                  type="text"
                  name="antiBot"
                  id="antiBot"
                  ref={antiBotRef}
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <p className="m-0 !text-black">
                {t("guestCheckout.ReCaptcha")} *
              </p>
              <label className="gap-1 font-medium !flex items-center">
                <div className="!w-3/12 border p-1 font-bold text-2xl flex justify-center items-center rounded-full">
                  <p ref={reCapcthaNum1} className="m-0 p-0 mx-1 !text-black">
                    {num1}
                  </p>
                  +
                  <p ref={reCapcthaNum2} className="m-0 p-0 mx-1 !text-black">
                    {num2}
                  </p>
                </div>

                <input
                  type="text"
                  ref={reCapcthaInput}
                  className="!w-9/12 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </label>
              <div className="flex  gap-2 items-center justify-center   w-full">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-[150px]  bg-third  text-primary hover:bg-second cursor-pointer   font-semibold py-3 rounded-lg mt-2 text-lg transition-colors duration-150"
                >
                  {t("guestCheckout.Add")}
                </motion.button>
                <StyledWrapper className="w-[200px]">
                  <div className="w-full">
                    <input
                      type="checkbox"
                      name="set_default"
                      id="checkbox"
                      checked={addFormik.values.set_default === 1}
                      onChange={(e) =>
                        addFormik.setFieldValue(
                          "set_default",
                          e.target.checked ? 1 : 0
                        )
                      }
                    />
                    <label
                      htmlFor="checkbox"
                      className="switch w-full font-semibold !py-3 rounded-lg mt-2 !text-lg select-none"
                    >
                      {t("guestCheckout.Set Default")}
                      {/* <svg
                        className="slider"
                        viewBox="0 0 512 512"
                        height="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z" />
                      </svg> */}
                    </label>
                  </div>
                </StyledWrapper>
              </div>
            </form>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddAddressModal;
