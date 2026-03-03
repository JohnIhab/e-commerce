import { createContext, useState } from "react";
import React from "react";
export const ApiAuthContext = createContext(0);

export default function ApiAuthContextProvider({ children }) {
   const [XApiKey, setXApiKey] = useState("PhXHpAKQ7W9HqsZpFcxAYnedFHChR83j");
  const [baseUrl, setBaseUrl] = useState(
    "https://site12698-scfv7q.scloudsite101.com/live/public/api/v1"
  );

  return (
    <ApiAuthContext.Provider
      value={{
        
        XApiKey,
        setXApiKey,
        baseUrl,
        setBaseUrl,
      }}
    >
      {children}
    </ApiAuthContext.Provider>
  );
}
