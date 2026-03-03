import React, { useContext, useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ApiAuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const PasswordConfirm = () => {
  const { t, i18n } = useTranslation();
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validation = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string()
          .email("passwordConfirm.errors.email_invalid")
          .required("passwordConfirm.errors.email_required"),
        code: Yup.string()
          .matches(/^\d{4,8}$/u, "passwordConfirm.errors.code_invalid")
          .required("passwordConfirm.errors.code_required"),
        password: Yup.string()
          .min(6, "passwordConfirm.errors.password_min")
          .required("passwordConfirm.errors.password_required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], "passwordConfirm.errors.password_mismatch")
          .required("passwordConfirm.errors.confirm_required"),
      }),
    [i18n.language]
  );

  async function handleSubmit(values) {
    setIsLoading(true);
    try {
      const payload = {
        email: values.email,
        code: values.code,
        password: values.password,
        password_confirmation: values.confirmPassword,
      };
      await axios.post(`${baseUrl}/auth/reset-password`, payload, {
        headers: { "Content-Type": "application/json", "x-api-key": XApiKey },
      });
      setIsLoading(false);
      toast.success(t("passwordConfirm.success"), {
        duration: 2500,
        style: { background: "#10B981", color: "#fff", fontWeight: "500" },
      });
      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      setIsLoading(false);
      if (error.code === "ERR_NETWORK") {
        toast.error(t("passwordConfirm.network"), {
          duration: 5000,
          style: { background: "#F59E0B", color: "#fff", fontWeight: "500" },
        });
      } else {
        toast.error(t("passwordConfirm.failed"), {
          duration: 5000,
          style: { background: "#EF4444", color: "#fff", fontWeight: "500" },
        });
      }
    }
  }

  const formik = useFormik({
    initialValues: { email: "", code: "", password: "", confirmPassword: "" },
    validationSchema: validation,
    onSubmit: handleSubmit,
  });

  const renderError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <div className="my-2 flex items-center">
        <span className="text-red-700 text-sm text-center font-medium px-3 rounded-xl">
          {t(formik.errors[field])}
        </span>
      </div>
    ) : null;

  return (
    <div className="min-h-[80vh] py-16 flex justify-center items-center bg-gray-50">
      <form
        className="w-11/12 md:w-6/12 lg:w-4/12 bg-white rounded-2xl shadow-xl p-8 md:p-10"
        onSubmit={formik.handleSubmit}
      >
        <div className="mb-6 text-center">
          <p className="text-3xl font-extrabold tracking-tight text-[#0e1733]">
            {t("passwordConfirm.page_title")}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t("passwordConfirm.subtitle")}
          </p>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            type="email"
            name="email"
            id="rp_email"
            className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="rp_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <p className="text-base font-semibold">{t("passwordConfirm.form.email")}</p>
          </label>
          {renderError("email")}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            onChange={formik.handleChange}
            value={formik.values.code}
            onBlur={formik.handleBlur}
            type="text"
            name="code"
            id="rp_code"
            className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="rp_code"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <p className="text-base font-semibold">{t("passwordConfirm.form.code")}</p>
          </label>
          {renderError("code")}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            type="password"
            name="password"
            id="rp_password"
            className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="rp_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <p className="text-lg font-bold">{t("passwordConfirm.form.password")}</p>
          </label>
          {renderError("password")}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            onBlur={formik.handleBlur}
            type="password"
            name="confirmPassword"
            id="rp_confirm"
            className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="rp_confirm"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <p className="text-lg font-bold">{t("passwordConfirm.form.confirmPassword")}</p>
          </label>
          {renderError("confirmPassword")}
        </div>

        <div className="w-full flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`my-5 self-end px-5 py-2 text-white rounded cursor-pointer transition-colors duration-200 ${
              isLoading ? "bg-gray-400" : "bg-[#0e1733] hover:bg-[#0b1228]"
            }`}
          >
            <p className="text-white md:text-lg font-semibold">
              {isLoading ? t("passwordConfirm.btn.resetting") : t("passwordConfirm.btn.reset")}
            </p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordConfirm;
