import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiAuthContext } from "./AuthContext";

export let CurrencyContext = createContext(0);

export default function CurrencyContextProvider(props) {
  const [currencyEn, setCurrencyEn] = useState("");
  const [currencyAr, setCurrencyAr] = useState("");

  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  async function getCurrency() {
    const res = await axios.get(`${baseUrl}/currencies/get-default`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return res.data.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["getCurrency"],
    queryFn: getCurrency,
  });
  useEffect(() => {
    if (data) {        
      setCurrencyEn(data.symbol_en);
      setCurrencyAr(data.symbol_ar);
    }
  }, [data]);

  return <CurrencyContext.Provider value={{currencyAr,currencyEn}}>{props.children}</CurrencyContext.Provider>;
}
