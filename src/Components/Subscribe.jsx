import React, { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiAuthContext } from "../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaCircleNotch } from "react-icons/fa";
import { FiMail, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";

const Subscribe = () => {
  const { t, i18n } = useTranslation();
  let { baseUrl, XApiKey, XTenantID } = useContext(ApiAuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isBot, setIsBot] = useState(false);
  const antiBotRef = useRef();

  let [isSent, setIsSent] = useState(false);
  let [isErr, setIsErr] = useState(false);
  let [ErrMsg, setErrMsg] = useState(false);

  const extra_key_input = useRef();

  const reCapcthaNum1 = useRef();
  const reCapcthaNum2 = useRef();
  const language = i18n.language;

  const reCapcthaInput = useRef(null);
  const [num1, setNum1] = useState(() => Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState(() => Math.floor(Math.random() * 10));

  let validation = Yup.object().shape({
    email: Yup.string()
      .email(language === "ar" ? "البريد الإلكتروني غير صالح" : "Invalid email")
      .required(
        language === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required"
      ),
  });

  async function handleSubscribe(values) {
    if (antiBotRef.current.value) {
      setIsBot(true);
      setErrMsg("Bot detected! Form submission blocked 🚫");
      setIsLoading(false);
      toast.error(ErrMsg || "Bot detected! Form submission blocked 🚫");
      return;
    }
    if (reCapcthaInput.current.value != num1 + num2) {
      
      toast.error(
        language === "ar" ? "رمز التحقق غير صحيح" : "Invalid captcha"
      );
      return;
    }
    try {
      setIsLoading(true);

      let { data } = await axios.post(`${baseUrl}/subscribe`, values, {
        headers: {
          "X-API-KEY": XApiKey,
        },
      });

      if (data.message === "Success") {
        setIsSent(true);
        toast.success(
          language === "ar" ? "تم الاشتراك بنجاح" : "Subscribed successfully"
        );
      }
    } catch (error) {
       setErrMsg(error.response.data.errors.email[0]);
      setIsErr(true);
      toast.error(
        error?.response?.data?.errors?.email?.[0] ||
          (language === "ar" ? "حدث خطأ أثناء الاشتراك" : "Subscription failed")
      );
    } finally {
      setIsLoading(false);
    }
  }

  let subscribeFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validation,
    onSubmit: handleSubscribe,
  });
  return (
    <>
      <div>
        {!isSent && !isErr && !isBot ? (
          <form
            onSubmit={subscribeFormik.handleSubmit}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 md:p-4">
              <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1 min-w-0">
                  <span
                    className={`absolute inset-y-0 flex items-center text-white/80 ${
                      language === "ar" ? "left-4" : "right-4"
                    }`}
                  >
                    <FiMail />
                  </span>
                  <input
                    onChange={subscribeFormik.handleChange}
                    value={subscribeFormik.values.email}
                    onBlur={subscribeFormik.handleBlur}
                    type="email"
                    name="email"
                    id="subscribe_email"
                    className={`w-full rounded-full bg-white/5 border border-white/20 text-white placeholder-white/60 h-12 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                      language === "ar" ? "pl-12 pr-4" : "pr-12 pl-4"
                    }`}
                    placeholder={
                      language === "ar"
                        ? "أدخل بريدك الإلكتروني"
                        : "Enter your email"
                    }
                    required
                  />
                </div>
                {subscribeFormik.touched.email &&
                subscribeFormik.errors.email ? (
                  <div className="-mt-2 mb-1">
                    <span className="text-red-300 text-xs font-medium">
                      {subscribeFormik.errors.email}
                    </span>
                  </div>
                ) : null}

                <label className="hidden">
                  <input
                    type="text"
                    name="antiBot"
                    id="antiBot"
                    ref={antiBotRef}
                  />
                </label>

                <div className="relative w-full md:w-56">
                  <input
                    ref={reCapcthaInput}
                    type="number"
                    id="ReCapcha"
                    className="w-full rounded-full bg-white/5 border border-white/20 text-white placeholder-white/60 px-4 h-12 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder={`${
                      language === "ar" ? "رمز التحقق" : "Recaptcha"
                    }: ${num1} + ${num2}`}
                    required
                  />
                </div>

                <div className="w-full md:w-auto">
                  <button
                    type="submit"
                    className="w-full md:w-48 inline-flex items-center justify-center gap-2 rounded-full h-12 text-white font-semibold bg-gradient-to-r from-gray-700/80 to-gray-300/80 hover:from-gray-700 hover:to-gray-300 transition-colors"
                  >
                    {language === "ar" ? "اشترك" : "Subscribe"}
                    {isLoading ? (
                      <span className="animate-spin">
                        <FaCircleNotch />
                      </span>
                    ) : (
                      <FiSend />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : null}

        {isBot ? (
          <div className="flex py-2 justify-center text-white font-bold">
            {ErrMsg}
          </div>
        ) : null}
        {isErr ? (
          <div className="flex py-2 justify-center text-white font-bold">
            {ErrMsg}
          </div>
        ) : null}

        {isSent ? (
          <div className="text-center text-white py-2 font-bold">
            Thank You For Your Subscription
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Subscribe;
