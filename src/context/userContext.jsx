import React, { createContext, useEffect, useState } from "react";

export let userContext = createContext(0);

export default function UserContextProvider(props) {
    const [isLogged, setIsLogged] = useState(false);
  
    useEffect(()=>{
          if(localStorage.getItem('token')){
        setIsLogged(true)
    }
    },[])
    
  return (


    <userContext.Provider value={{ isLogged, setIsLogged }}>
            {props.children}
    </userContext.Provider>
    
    
  )
}
