// import React, { createContext, useState } from "react";
// export const AddressContext = createContext(0);

// export default function AddressContextProvider(props) {
//   const [isSentC, setIsSentC] = useState(false);
  
//   return <AddressContext.Provider value={{isSentC, setIsSentC}}>{props.children}</AddressContext.Provider>;
// }
import React, { createContext, useState } from "react";

export const AddressContext = createContext(null);

export default function AddressContextProvider({ children }) {
  const [addressChanged, setAddressChanged] = useState(Date.now());
  const [isSentC, setIsSentC] = useState(false);

  return (
    <AddressContext.Provider
      value={{
        addressChanged,
        setAddressChanged,
        isSentC,
        setIsSentC
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}
