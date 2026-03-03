import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiAuthContext } from "./AuthContext";

export let AddressesContext = createContext(0);

export default function AddressesProvider(props) {
  const [addressChanged, setAddressChanged] = useState(null);

  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [addresses, setAddresses] = useState([]);
  const [defaultChanged, setDefaultChanged] = useState(null);
  

  async function getAddresses() {
    const response = await axios.get(`${baseUrl}/auth/address`, {
      headers: {
        "x-api-key": XApiKey,
        Authorization: localStorage.getItem("token"),
      },
    });

    return response.data.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["Addresses", defaultChanged, addressChanged],
    queryFn: getAddresses,
    enabled: !!localStorage.getItem("token")
  });
  useEffect(() => {
    if (data) {
 
      setAddresses(data);
    }
  }, [data]);

  return (
    <AddressesContext.Provider value={{ addresses, isLoading, setAddressChanged,setDefaultChanged }}>
      {props.children}
    </AddressesContext.Provider>
  );
}
