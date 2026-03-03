import React, { useContext, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ApiAuthContext } from "../../context/AuthContext";
import Loader from "../../Components/Loader";
import { useTranslation } from "react-i18next";
import { FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { AiOutlineQuestionCircle, AiOutlineCheck } from "react-icons/ai";

export default function Points() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const queryClient = useQueryClient();
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState(null);
  const [convertSuccess, setConvertSuccess] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  async function getPoints() {
    const headers = {
      "X-API-KEY": XApiKey,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    const response = await axios.get(`${baseUrl}/points`, { headers });
    return response.data.data;
  }

  const {
    data: points,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["Points"],
    queryFn: getPoints,
  });

  async function handleConvert() {
    setConvertError(null);
    setConvertSuccess(null);
    if (!points || !points.available_points) return;
    try {
      setConverting(true);
      const headers = {
        "X-API-KEY": XApiKey,
        Authorization: "Bearer " + localStorage.getItem("token"),
      };
      const response = await axios.post(
        `${baseUrl}/points/convert`,
        {},
        { headers }
      );
      const successMsg =
        response.data?.message || t("profile-points.Converted successfully");
      setConvertSuccess(successMsg);
      toast.success(successMsg, { duration: 3000 });
      setShowConfirmModal(false);
      // refetch points
      queryClient.invalidateQueries(["Points"]);
    } catch (err) {
      setConvertError(
        err?.response?.data?.message || err.message || "Conversion failed"
      );
      toast.error(
        err?.response?.data?.message || err.message || "Conversion failed",
        { duration: 4000 }
      );
    } finally {
      setConverting(false);
    }
  }

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-sm text-red-300">
        {t("profile-points.error")}: {error?.message}
      </p>
    );
  if (!points)
    return (
      <p className="text-sm text-gray-300">{t("profile-points.no_data.")}</p>
    );

  return (
    <div>
      <h3 className="text-xl font-bold flex items-center gap-2">
        <FaRegStar size={20} /> {t("Points") || "Points"}
      </h3>

      <div className="bg-third text-white p-4 rounded-lg my-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <h4 className="font-bold">{t("profile-points.Total Points")}</h4>
            <p className="text-2xl font-extrabold">{points.total_points}</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <h4 className="font-bold">
              {t("profile-points.Available Points")}
            </h4>
            <p className="text-2xl font-extrabold">{points.available_points}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                className="bg-third text-white px-3 py-1 rounded "
                onClick={() => {
                  // If no available points, show toast
                  if (
                    !points ||
                    !points.available_points ||
                    points.available_points <= 0
                  ) {
                    toast.error(
                      t("profile-points.There is 0 available point") ||
                        "There is 0 available point"
                    );
                    return;
                  }
                  // show confirmation modal
                  setShowConfirmModal(true);
                }}
                disabled={converting}
              >
                {converting
                  ? "Converting..."
                  : t("profile-points.Convert Points") || "Convert Points"}
              </button>
              {convertSuccess && (
                <span className="text-sm text-green-300">{convertSuccess}</span>
              )}
              {convertError && (
                <span className="text-sm text-red-300">{convertError}</span>
              )}
            </div>

            {showConfirmModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                aria-modal="true"
                role="dialog"
              >
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowConfirmModal(false)}
                />

                <motion.div
                  initial={{ y: 20, scale: 0.98 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 20, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative z-10 max-w-md w-full bg-primary   rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3 border-b border-gray-100 ">
                    <div className="bg-third text-primary rounded-full p-2">
                      <AiOutlineQuestionCircle size={26} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 ">
                        {t("profile-points.Confirm Conversion") ||
                          "Confirm Conversion"}
                      </h3>
                      <p className="text-sm text-third  ">
                        {t(
                          "profile-points.This action will convert your available points to rewards."
                        ) ||
                          "This action will convert your available points to rewards."}
                      </p>
                    </div>
                    <button
                      aria-label="Close"
                      onClick={() => setShowConfirmModal(false)}
                      className="ml-auto text-third"
                    >
                      <span aria-hidden>✕</span>
                    </button>
                  </div>

                  <div className="p-5">
                    <p className="text-center text-sm text-third">
                      {t("profile-points.Do you need to convert")}
                    </p>

                    <p className="text-center text-xl font-bold text-third  ">
                      {points.available_points}
                    </p>
                    <div className="mt-6 flex items-center justify-end gap-3">
                      <button
                        onClick={() => setShowConfirmModal(false)}
                        className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-third hover:border-secondary duration-500 hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                      >
                        {t("profile-points.Cancel") || "Cancel"}
                      </button>
                      <button
                        onClick={handleConvert}
                        disabled={converting}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-primary bg-third hover:scale-105 transform transition duration-200 disabled:opacity-60 focus:outline-none"
                      >
                        {converting ? (
                          t("profile-points.Converting...") || "Converting..."
                        ) : (
                          <>
                            <AiOutlineCheck className="w-4 h-4" aria-hidden />
                            <span className="font-medium">
                              {t("profile-points.Yes, convert") ||
                                "Yes, convert"}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <h4 className="font-bold">{t("profile-points.Used Points")}</h4>
            <p className="text-2xl font-extrabold">{points.used_points}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
