import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { ApiAuthContext } from "./AuthContext";
import { useTranslation } from "react-i18next";

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compareChanged, setComparechanged] = useState("");

  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

  async function getCompareList() {
    const response = await axios.get(`${baseUrl}/auth/compare`, {
      headers: {
        "X-API-KEY": XApiKey,
        ...(localStorage.getItem("token")
          ? { Authorization: `${localStorage.getItem("token")}` }
          : localStorage.getItem("tempUserId")
          ? { "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}` }
          : {}),
      },
    });

    return response.data;
  }
  const { data, isError, error, isLoading, Loading } = useQuery({
    queryKey: ["getCompareList", compareChanged],
    queryFn: getCompareList,
  });
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      setCompareList(data.data);
    }
  }, [data]);

  const addToCompare = async (product_id) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/auth/compare`,
        { product_id },
        {
          headers: {
            "X-API-KEY": XApiKey,
            ...(localStorage.getItem("token")
              ? { Authorization: `${localStorage.getItem("token")}` }
              : localStorage.getItem("tempUserId")
              ? { "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}` }
              : {}),
          },
        }
      );

      if (data?.status) {
        toast.success(t("compare.Added to compare"));
        getCompareList();
      } else {
        toast.error(data?.message || t("compare.Failed to add to compare"));
      }

 
      if (
        !localStorage.getItem("token") &&
        !localStorage.getItem("tempUserId") &&
        data.data.temp_user_id
      ) {
        localStorage.setItem("tempUserId", data.data.temp_user_id);
      }
    } catch (err) {
      toast.error(t("compare.Error adding product"));
      console.error(err);
    }
  };

  const removeFromCompare = async (id) => {
    try {
      const { data } = await axios.delete(`${baseUrl}/auth/compare/${id}`, {
        headers: {
          "X-API-KEY": XApiKey,
          ...(localStorage.getItem("token")
            ? { Authorization: `${localStorage.getItem("token")}` }
            : localStorage.getItem("tempUserId")
            ? { "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}` }
            : {}),
        },
      });

      if (data?.status) {
        toast.success(t("compare.Removed from compare"));
        setCompareList((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(data?.message || t("compare.Failed to remove item"));
      }
    } catch (err) {
      toast.error(t("compare.Error removing product"));
      console.error(err);
    }
  };

  useEffect(() => {
    getCompareList();
  }, []);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        loading,
        getCompareList,
        addToCompare,
        removeFromCompare,
        setComparechanged,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
