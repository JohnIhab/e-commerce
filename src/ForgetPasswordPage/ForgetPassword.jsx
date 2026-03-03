import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { ApiAuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const ForgetPassword = () => {
  const { t } = useTranslation();
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // --- Validation using translation keys ---
  const validation = Yup.object().shape({
    email: Yup.string()
      .email("forgot.invalidEmail")
      .required("forgot.emailRequired"),
  });

  async function handleSubmit(values) {
    setIsLoading(true);
    try {
      const payload = { email: values.email };

      await axios.post(`${baseUrl}/auth/forgot-password`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": XApiKey,
        },
      });

      toast.success(t("forgot.codeSent"), {
        duration: 3000,
        style: { background: "#10B981", color: "#fff", fontWeight: "500" },
      });

      setTimeout(() => navigate("/password-confirm"), 300);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error(t("forgot.networkError"));
      } else {
        toast.error(t("forgot.unableToSend"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend(email) {
    if (!email) {
      toast.error(t("forgot.enterEmailFirst"));
      return;
    }
    setIsResending(true);

    try {
      const payload = { email };

      await axios.post(`${baseUrl}/auth/forgot-password/resend`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": XApiKey,
        },
      });

      toast.success(t("forgot.codeResent"), {
        duration: 3000,
        style: { background: "#10B981", color: "#fff", fontWeight: "500" },
      });
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error(t("forgot.networkError"));
      } else {
        toast.error(t("forgot.unableToResend"));
      }
    } finally {
      setIsResending(false);
    }
  }

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: validation,
    onSubmit: handleSubmit,
  });

  return (
    <div className="min-h-[80vh] py-16 flex justify-center items-center bg-gray-50">
      <form
        className="w-11/12 md:w-6/12 lg:w-4/12 bg-white rounded-2xl shadow-xl p-8 md:p-10"
        onSubmit={formik.handleSubmit}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-3xl font-extrabold tracking-tight text-[#0e1733]">
            {t("forgot.title")}
          </p>
          <p className="text-sm text-gray-500 mt-2">{t("forgot.subtitle")}</p>
        </div>

        {/* Email Input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            type="email"
            name="email"
            id="fp_email"
            className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent 
            border-0 border-b-2 border-gray-300 appearance-none focus:outline-none 
            focus:ring-0 focus:border-[#0e1733] peer"
            placeholder=" "
            required
          />

          <label
            htmlFor="fp_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 
            transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
            peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
            peer-focus:-translate-y-6"
          >
            <p className="text-base font-semibold">{t("forgot.emailLabel")}</p>
          </label>

          {formik.touched.email && formik.errors.email ? (
            <div className="my-2 flex items-center">
              <span className="text-red-700 text-sm text-center font-medium px-3 rounded-xl">
                {t(formik.errors.email)}
              </span>
            </div>
          ) : null}
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-end items-center">


          <button
            type="submit"
            disabled={isLoading}
            className={`my-5 self-end px-5 py-2 text-white rounded cursor-pointer transition-colors duration-200 ${
              isLoading ? "bg-gray-400" : "bg-[#0e1733] hover:bg-[#0b1228]"
            }`}
          >
            <p className="md:text-lg font-semibold flex items-center gap-2">
              {isLoading ? t("forgot.sending") : t("forgot.sendCode")}
            </p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;
