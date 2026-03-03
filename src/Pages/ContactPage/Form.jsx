import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ApiAuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const Form = () => {
  const { XTenantID, XApiKey, baseUrl } = useContext(ApiAuthContext);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    extra_key: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.extra_key && formData.extra_key.trim() !== "") {
      toast.error(t("contact.form.invalidSubmission"));
      return;
    }

    setLoading(true);
    const apiData = { ...formData, extra_key: null };

    try {
      const response = await axios.post(`${baseUrl}/contact-us`, apiData, {
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-ID": XTenantID,
          "X-API-KEY": XApiKey,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(t("contact.form.successToast"));
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
          extra_key: "",
        });
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t("contact.form.errorToast"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl w-full mx-auto shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          {t("contact.form.title")}
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          {t("contact.form.subtitle")}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center bg-gradient-to-r from-base to-emerald-700 text-white rounded-xl justify-center min-h-[220px] p-8 shadow-inner"
          >
            <h3 className="text-2xl font-semibold mb-2">
              {t("contact.form.thanksTitle")}
            </h3>
            <p className="text-center max-w-md leading-relaxed opacity-90">
              {t("contact.form.thanksBody")}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Name + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("contact.form.fullName")} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t("contact.form.fullNamePlaceholder")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-base/70 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("contact.form.phone")} *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder={t("contact.form.phonePlaceholder")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-base/70 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("contact.form.email")} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t("contact.form.emailPlaceholder")}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-base/70 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("contact.form.message")} *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder={t("contact.form.messagePlaceholder")}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-base/70 focus:border-transparent outline-none transition-all duration-200 resize-none"
              />
            </div>

            {/* Hidden honeypot */}
            <div className="hidden">
              <input
                type="text"
                id="extra_key"
                name="extra_key"
                value={formData.extra_key}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-third hover:bg-base/90 hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("contact.form.sending")}
                  </div>
                ) : (
                  t("contact.form.send")
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Form;
