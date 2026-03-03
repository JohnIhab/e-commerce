import React, { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios from "axios";
import { ApiAuthContext } from "../context/AuthContext";

const ConfirmCode = () => {
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Keep for backward compatibility if needed later
  const INITIAL_USER_ID = useMemo(() => {
    const fromState = location.state?.userId;
    if (fromState) return fromState;
    try {
      const stored = localStorage.getItem("pendingUserId");
      return stored ? Number(stored) : "";
    } catch {
      return "";
    }
  }, [location.state]);

  const validation = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    code: Yup.string()
      .matches(/^\d{4,8}$/u, "Enter a valid code")
      .required("Verification code is required"),
  });

  async function handleConfirm(values) {
    setIsLoading(true);
    try {
      const payload = { email: values.email, code: values.code };

      await axios.post(`${baseUrl}/auth/verify-email`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": XApiKey,
        },
      });

      toast.dismiss();
      toast.success("Verification successful! You can now log in.", {
        duration: 2500,
        style: { background: "#10B981", color: "#fff", fontWeight: "500" },
      });

      try {
        localStorage.removeItem("pendingUserId");
      } catch {
        void 0;
      }
      setIsLoading(false);
      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();
      if (error.response?.status === 400) {
        toast.error("Invalid code or user id.", { duration: 4000 });
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Network error! Check your connection", { duration: 4000 });
      } else {
        toast.error("Verification failed! Please try again.", {
          duration: 4000,
        });
      }
    }
  }

  async function handleResend() {
    setIsResending(true);
    try {
      const payload = { email: formik.values.email };
      await axios.post(`${baseUrl}/auth/resend-verify-email`, payload, {
        headers: { "Content-Type": "application/json", "x-api-key": XApiKey },
      });
      toast.success("Verification code resent to your email.", {
        duration: 2500,
        style: { background: "#10B981", color: "#fff", fontWeight: "500" },
      });
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Network error! Check your connection");
      } else {
        toast.error("Unable to resend code. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  }

  const formik = useFormik({
    initialValues: { email: "", code: "" },
    validationSchema: validation,
    enableReinitialize: true,
    onSubmit: handleConfirm,
  });

  return (
    <div className="min-h-[80vh] py-16 flex justify-center items-center bg-gray-50">
      <form
        className="w-11/12 md:w-6/12 lg:w-4/12 bg-white rounded-2xl shadow-xl p-8 md:p-10"
        onSubmit={formik.handleSubmit}
      >
        <div className="mb-6 text-center">
          <p className="text-3xl font-extrabold tracking-tight text-[#0e1733]">
            Verify your email
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Enter the 6-digit code we sent to your email address
          </p>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            type="email"
            name="email"
            id="verification_email"
            className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="verification_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <p className="text-base font-semibold">Email Address</p>
          </label>
          {formik.touched.email && formik.errors.email ? (
            <div className="my-2 flex items-center  ">
              <span className="text-red-700 text-sm text-center font-medium px-3 rounded-xl">
                {formik.errors.email}
              </span>
            </div>
          ) : null}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            onChange={formik.handleChange}
            value={formik.values.code}
            onBlur={formik.handleBlur}
            type="text"
            name="code"
            id="verification_code"
            className="block py-3 px-0 w-full text-sm text-[#0e1733] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#0e1733] peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="verification_code"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-[#0e1733] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <p className="text-base font-semibold">Verification Code</p>
          </label>
          {formik.touched.code && formik.errors.code ? (
            <div className="my-2 flex items-center  ">
              <span className="text-red-700 text-sm text-center font-medium px-3 rounded-xl">
                {formik.errors.code}
              </span>
            </div>
          ) : null}
        </div>

        <div className="w-full flex justify-between items-center ">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className={`my-5 px-5 py-2 rounded text-white transition-colors duration-200 ${
              isResending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-slate-600 hover:bg-slate-700"
            }`}
          >
            {isResending ? "Resending..." : "Resend code"}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`my-5 self-end px-5 py-2 text-white rounded cursor-pointer transition-colors duration-200 ${
              isLoading ? "bg-gray-400" : "bg-[#0e1733] hover:bg-[#0b1228]"
            }`}
          >
            <p className="text-white md:text-lg font-semibold flex items-center gap-2">
              {isLoading ? "Verifying..." : "Confirm"}
            </p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmCode;
