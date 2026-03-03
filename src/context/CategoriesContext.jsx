import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiAuthContext } from "./AuthContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const CategoriesContext = createContext(0);

export default function CategoriesContextProvider({ children }) {
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
    const [categories, setCategories] = useState([])
  

  async function getCategories() {
    const response = await axios.get(`${baseUrl}/product-categories`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return response.data.data.categories.data
  }

  const {data,isLoading,isError} = useQuery({
    queryKey:["getCategories"],
    queryFn:getCategories
  })

 useEffect(()=>{
     if(data){
     
    setCategories(data)
  }
 },[data])
  return <CategoriesContext.Provider value={{categories}}>{ children }</CategoriesContext.Provider>;
}
