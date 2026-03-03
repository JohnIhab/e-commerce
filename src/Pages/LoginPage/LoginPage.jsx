import React, { useContext, useState } from "react";
import { RiLoginCircleFill } from "react-icons/ri";
import { ApiAuthContext } from "../../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";
import { Helmet } from "react-helmet";
import { FaEye } from "react-icons/fa";
import Login from "./Login";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>{"JootBag | Home"}</title>
        <meta name="description" content="JootBagHome" />
      </Helmet>
      <div
        className=" w-full py-40     flex justify-center items-center  "
        
      >
        <div className="w-11/12 md:w-6/12 lg:w-4/12">
          <Login />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
