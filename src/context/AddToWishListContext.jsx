import React, { createContext, useContext, useState } from "react";
import { ApiAuthContext } from "./AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
  
export const addToWishListContext = createContext(0);

export default function AddToWishListContextProvider({ children }) {
   
  
  const [isLoginModel, setIsLoginModel] = useState(false);
  // const navigate = useNavigate();
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [addLoading, setAddLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  async function addToWishlist(product_id) {
    setAddLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/auth/wishlist`,
        { product_id },
        {
          headers: {
            "X-API-KEY": XApiKey,
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response?.message || "Product Added Successfully", {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "500",
        },
      });

       setAddLoading(false);
    } catch (error) {
 
      console.error(error.response?.data || error.message);
       if (
        error.response?.data.message ==
        "Unauthorized: Token not found or invalid"
      ) {
        toast.error("Please Login First", {
          duration: 2000,
        });
       
      }
      else
      toast.error(error.response?.data.message , {
          duration: 2000,
        });
      console.error(error.response?.data.message );
     

      setAddLoading(false);
    }
  }
  return (
    <addToWishListContext.Provider value={{ addToWishlist, addLoading }}>
      {children}
    </addToWishListContext.Provider>
  );
}
