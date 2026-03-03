import React, { useContext, useState } from "react";
import { RiUserAddFill } from "react-icons/ri";
import { ApiAuthContext } from "../../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaEye } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { t } = useTranslation();
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation schema with keys instead of translated text
  const validation = Yup.object().shape({
    
    name: Yup.string()
      .min(2, "signup.errors.name_min")
      .required("signup.errors.name_required"),
    email: Yup.string()
      .email("signup.errors.email_invalid")
      .required("signup.errors.email_required"),
    password: Yup.string()
      .min(6, "signup.errors.password_min")
      .required("signup.errors.password_required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "signup.errors.password_match")
      .required("signup.errors.confirm_required"),
  });

  const handleSignUp = async (values) => {
    setIsLoading(true);

    try {
      if (values.extra_key) throw new Error("spam_detected");

      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.confirmPassword,
        extra_key: "",
      };

      const { data } = await axios.post(`${baseUrl}/auth/register`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": XApiKey,
        },
      });

      setIsLoading(false);

      if (data?.status === true || data?.code === 201) {
        toast.dismiss();
        toast.success(data?.message || t("signup.success"), {
          duration: 3000,
          style: { background: "#10B981", color: "#fff", fontWeight: "500" },
        });

        const newUserId = data?.data?.id || data?.user_id;
        if (newUserId) localStorage.setItem("pendingUserId", String(newUserId));

        navigate("/confirm-code", { state: { userId: newUserId } });
      } else {
        toast.dismiss();
        toast.error(t("signup.failed"), {
          duration: 4000,
          style: { background: "#EF4444", color: "#fff", fontWeight: "500" },
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();

      if (error.message === "spam_detected") return;
      if (error.response?.status === 400) {
        toast.error(t("signup.error_400"), {
          duration: 5000,
          style: { background: "#EF4444", color: "#fff", fontWeight: "500" },
        });
      } else if (error.response?.status === 409) {
        toast.error(t("signup.error_409"), {
          duration: 5000,
          style: { background: "#F59E0B", color: "#fff", fontWeight: "500" },
        });
      } else if (error.code === "ERR_NETWORK") {
        toast.error(t("signup.network"), {
          duration: 5000,
          style: { background: "#F59E0B", color: "#fff", fontWeight: "500" },
        });
      } else {
        toast.error(t("signup.failed_general"), {
          duration: 4000,
          style: { background: "#EF4444", color: "#fff", fontWeight: "500" },
        });
      }
    }
  };

  const signupFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      extra_key: "",
    },
    validationSchema: validation,
    onSubmit: handleSignUp,
  });

  // Function to render field error with translation
  const renderError = (field) =>
    signupFormik.touched[field] && signupFormik.errors[field] ? (
      <div className="my-2 flex items-center">
        <span className="text-red-700 text-sm text-center font-medium px-3 rounded-xl">
          {t(signupFormik.errors[field])}
        </span>
      </div>
    ) : null;

  return (
    <>
      <Helmet>
        <title>{t("signup.page_title")}</title>
        <meta name="description" content="JootBagSignUp" />
      </Helmet>

      <div className="min-h-[80vh] py-40 flex justify-center items-center bg-gray-50">
        <form
          className="w-11/12 md:w-6/12 lg:w-4/12 bg-white rounded-2xl shadow-xl p-8 md:p-10"
          onSubmit={signupFormik.handleSubmit}
        >
          <div className="mb-6 text-center">
            <p className="text-3xl font-extrabold tracking-tight text-[#0e1733]">
              {t("signup.title")}
            </p>
            <p className="text-sm text-gray-500 mt-2">{t("signup.subtitle")}</p>
          </div>

          {/* Name */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              onChange={signupFormik.handleChange}
              value={signupFormik.values.name}
              onBlur={signupFormik.handleBlur}
              type="text"
              name="name"
              id="floating_name"
              className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              <p className="text-base font-semibold">{t("signup.form.name")}</p>
            </label>

            {renderError("name")}
          </div>

          {/* Email */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              onChange={signupFormik.handleChange}
              value={signupFormik.values.email}
              onBlur={signupFormik.handleBlur}
              type="email"
              name="email"
              id="floating_email"
              className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              <p className="text-base font-semibold">{t("signup.form.email")}</p>
            </label>

            {renderError("email")}
          </div>

          {/* Password */}
          <div className="relative z-0 w-full mb-5 group">
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-2 top-2 flex justify-center items-center px-2 rounded-full cursor-pointer order-1"
            >
              <FaEye size={25} />
            </div>
            <input
              onChange={signupFormik.handleChange}
              value={signupFormik.values.password}
              onBlur={signupFormik.handleBlur}
              type={showPassword ? "text" : "password"}
              name="password"
              id="floating_password"
              className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              <p className="text-base font-semibold">{t("signup.form.password")}</p>
            </label>

            {renderError("password")}
          </div>

          {/* Confirm Password */}
          <div className="relative z-0 w-full group">
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute end-2 top-2 flex justify-center items-center px-2 rounded-full cursor-pointer order-1"
            >
              <FaEye size={25} />
            </div>
            <input
              onChange={signupFormik.handleChange}
              value={signupFormik.values.confirmPassword}
              onBlur={signupFormik.handleBlur}
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="floating_confirm_password"
              className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_confirm_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              <p className="text-base font-semibold">{t("signup.form.confirm_password")}</p>
            </label>

            {renderError("confirmPassword")}
          </div>

          {/* Honeypot */}
          <div className="hidden">
            <input
              type="text"
              name="extra_key"
              autoComplete="off"
              tabIndex={-1}
              value={signupFormik.values.extra_key}
              onChange={signupFormik.handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`my-6 self-end px-5 py-2 text-white rounded cursor-pointer transition-colors duration-200 ${
                isLoading ? "bg-gray-400" : "bg-[#0e1733] hover:bg-[#0b1228]"
              }`}
            >
              <p className="text-white md:text-lg font-semibold flex items-center gap-2">
                <RiUserAddFill />
                {isLoading ? t("signup.btn.loading") : t("signup.btn.create")}
              </p>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-2">
            <p className="text-gray-500 text-sm">
              {t("signup.have_account")}{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#0e1733] font-semibold hover:underline"
              >
                {t("signup.signin")}
              </button>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;

