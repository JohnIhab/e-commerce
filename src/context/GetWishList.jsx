import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiAuthContext } from "./AuthContext";

export let Wishlist = createContext(0);

export default function WishlistProvider(props) {
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [WishList, setWishlist] = useState([]);
  const [changed, setChanged] = useState(null);
  const [counter, setCounter] = useState(0);
  async function getWishList() {
    const response = await axios.get(`${baseUrl}/auth/wishlist`, {
      headers: {
        "X-API-KEY": XApiKey,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data.data;
  }
  const { data, isError, isLoading } = useQuery({
    queryKey: ["wishlist", changed],
    queryFn: getWishList,
    enabled: !!localStorage.getItem("token"),
  });

  useEffect(() => {
    if (data) {
       
      setWishlist(data);
      setCounter(data.length)
    }
  }, [data]);

    useEffect(()=>{
      if(!localStorage.getItem("token")){
        setCounter(0)
      }
  },[changed])

  return <Wishlist.Provider value={{WishList,isLoading,setChanged, counter}}>{props.children}</Wishlist.Provider>;
}
