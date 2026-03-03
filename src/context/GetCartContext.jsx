import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiAuthContext } from "./AuthContext";

export let Cart = createContext(0);

export default function CartProvider(props) {
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [items, setItems] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [cart, setCart] = useState({});
  const [changed, setChanged] = useState(0);
  const [cartCounter, setCartCounter] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [tempUserId, setTempUserId] = useState(
    localStorage.getItem("tempUserId")
  );

  async function getCart() {
    const response = await axios.get(`${baseUrl}/carts`, {
      headers: {
        "X-API-KEY": XApiKey,
        ...(localStorage.getItem("token")
          ? { Authorization: `${localStorage.getItem("token")}` }
          : localStorage.getItem("tempUserId")
          ? { "X-Temp-User-Id": `${localStorage.getItem("tempUserId")}` }
          : {}),
      },
    });
     
    return response.data.data;
  }
  const { data, isError, isLoading } = useQuery({
    queryKey: ["Cart", changed, token, tempUserId],
    queryFn: getCart,
  });

  useEffect(() => {
    if (data) {
       
   
      console.log(data);
      
      setItems(data.items);
      setBundles(data.bundle_offers);
      setCart(data);

      setCartCounter(data.items.length);

    }
  }, [data]);
  useEffect(() => {
    if (!tempUserId && !token) {
      setCart({});
    } else {
      getCart();
    }
  }, [token, tempUserId]);
  return (
    <Cart.Provider
      value={{
        items,
        isLoading,
        setChanged,
        cart,
        bundles,
        cartCounter,
        setCart,
        setToken
      }}
    >
      {props.children}
    </Cart.Provider>
  );
}
