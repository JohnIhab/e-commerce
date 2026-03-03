import React, { useContext, useState } from "react";
import { RiLoginCircleFill } from "react-icons/ri";
import { ApiAuthContext } from "../../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";
import { FaEye } from "react-icons/fa";
import { Wishlist } from "../../context/GetWishList";
import { Cart } from "../../context/GetCartContext";
import { useCompare } from "../../context/CompareContext";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();

  const { setComparechanged } = useCompare();
  const { setChanged } = useContext(Wishlist);
  const { setToken } = useContext(Cart);
  const { setIsLogged } = useContext(userContext);
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Validation (return keys instead of text) ---
  const validation = Yup.object().shape({
    email: Yup.string()
      .email("login.invalidEmail")
      .required("login.emailRequired"),
    password: Yup.string()
      .min(6, "login.passwordMin")
      .required("login.passwordRequired"),
  });

  // --- Login Handler ---
  async function handleLogin(values) {
    setIsLoading(true);

    try {
      const payload = {
        email: values.email,
        password: values.password,
      };

      let { data } = await axios.post(`${baseUrl}/auth/login`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": XApiKey,
        },
      });

      if (data?.status === true || data?.code === 200) {
        setIsLoading(false);

        const token = data?.data?.token || data?.access_token;
        const tokenType = data?.data?.token_type || "Bearer";

        if (token) {
          localStorage.setItem("token", `${tokenType} ${token}`);
        }

        setIsLogged(true);

        toast.dismiss();
        toast.success(t("login.loginSuccess"), {
          duration: 2000,
          style: {
            background: "#10B981",
            color: "#fff",
            fontWeight: "500",
          },
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);

        setToken(token);
      }

      localStorage.removeItem("tempUserId");
      setChanged(Date.now());
      setComparechanged(Date.now());
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();

      if (error.response?.status === 401) {
        toast.error(t("login.loginFailed"), {
          duration: 5000,
          style: {
            background: "#EF4444",
            color: "#fff",
            fontWeight: "500",
          },
        });
      } else if (error.code === "ERR_NETWORK") {
        toast.error(t("login.networkError"), {
          duration: 5000,
          style: {
            background: "#F59E0B",
            color: "#fff",
            fontWeight: "500",
          },
        });
      } else {
        toast.error(t("login.loginFailed"), {
          duration: 4000,
          style: {
            background: "#EF4444",
            color: "#fff",
            fontWeight: "500",
          },
        });
      }
    }
  }

  // --- Formik ---
  let loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validation,
    onSubmit: handleLogin,
  });

  return (
    <>
      <form
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white rounded-2xl shadow-xl p-8 md:p-10"
        onSubmit={loginFormik.handleSubmit}
      >
        {/* Title */}
        <div className="mb-6 text-center">
          <p className="text-3xl font-extrabold tracking-tight text-[#0e1733]">
            {t("login.welcome")}
          </p>
          <p className="text-sm text-gray-500 mt-2">{t("login.subtitle")}</p>
        </div>

        {/* Email Input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            onChange={loginFormik.handleChange}
            value={loginFormik.values.email}
            onBlur={loginFormik.handleBlur}
            type="email"
            name="email"
            id="floating_email"
            className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 
            border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 
            transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
            peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <p className="text-base font-semibold">{t("login.email")}</p>
          </label>

          {loginFormik.touched.email && loginFormik.errors.email ? (
            <div className="my-2">
              <span className="text-red-700 text-sm font-medium px-3 rounded-xl">
                {t(loginFormik.errors.email)}
              </span>
            </div>
          ) : null}
        </div>

        {/* Password Input */}
        <div className="relative z-0 w-full group">
          <div className="flex justify-between">
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-2 top-2 flex justify-center items-center cursor-pointer"
            >
              <FaEye size={25} />
            </div>

            <input
              onChange={loginFormik.handleChange}
              value={loginFormik.values.password}
              onBlur={loginFormik.handleBlur}
              type={showPassword ? "text" : "password"}
              name="password"
              id="floating_password"
              className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 
              border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
              placeholder=" "
              required
            />

            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 
              transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
              peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              <p className="text-base font-semibold">{t("login.password")}</p>
            </label>
          </div>

          {loginFormik.touched.password && loginFormik.errors.password ? (
            <div className="my-2">
              <span className="text-red-700 text-sm font-medium px-3 rounded-xl">
                {t(loginFormik.errors.password)}
              </span>
            </div>
          ) : null}
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-red-600 hover:text-red-800"
          >
            {t("login.forgotPassword")}
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={`my-5 px-5 py-2 text-white rounded transition-colors ${
              isLoading ? "bg-gray-400" : "bg-[#0e1733] hover:bg-[#0b1228]"
            }`}
          >
            <p className="md:text-lg font-semibold flex items-center gap-2">
              <RiLoginCircleFill />
              {isLoading ? t("login.loggingIn") : t("login.loginBtn")}
            </p>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-2">
          <p className="text-gray-500 text-sm">
            {t("login.noAccount")}{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#0e1733] font-semibold hover:underline"
            >
              {t("login.createAccount")}
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default Login;
