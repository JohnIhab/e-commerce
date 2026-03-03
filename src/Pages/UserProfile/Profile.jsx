import React, { useContext, useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { HiOutlinePhone } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useOutletContext } from "react-router-dom";
import { useFormik } from "formik";
import { FaCircleNotch } from "react-icons/fa6";
import toast from "react-hot-toast";

import * as Yup from "yup";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { userData, setChanged } = useOutletContext();
  const [emailChange, setEmailChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isNameLoading, setIsNameLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const [newEmail, setNewEmail] = useState(t("profileDetails.newEmail"));

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    if (emailChange) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [emailChange]);
  // async function requestChangeEmail(values) {
  //   const response = await axios.post(`${baseUrl}/auth/profile/request-email-change`, {
  //     values,
  //     headers:{
  //        "X-API-KEY": XApiKey,
  //       Authorization: `${localStorage.getItem("token")}`,
  //     }
  //   })
  // }
  async function requestChangeEmail(values) {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/auth/profile/request-email-change`,
        values, // ← body
        {
          headers: {
            "X-API-KEY": XApiKey,
            Authorization: localStorage.getItem("token"),
          },
        }
      );
       setNewEmail(values.new_email);
      setEmailChange(true);
    } catch (error) {
      console.error("Request Change Email Error:", error);
    } finally {
      setIsLoading(false);
    }
  }
  async function confirmChangeEmail(values) {
    setIsConfirmLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/auth/profile/confirm-email-change`,
        values,
        {
          headers: {
            "X-API-KEY": XApiKey,
            Authorization: localStorage.getItem("token"),
          },
        }
      );
       setEmailChange(false);
      toast.success(
        response?.data?.message ||
          `${
            lang === "en"
              ? "Email Changed successfully."
              : "تم تغيير البريد الإلكتروني بنجاح"
          }`,
        {
          duration: 2000,
          style: {
            background: "#10B981",
            color: "#fff",
            fontWeight: "500",
          },
        }
      );
      setChanged(Date.now());
    } catch (error) {
      console.error("Confirm Change Email Error:", error);
    } finally {
      setIsConfirmLoading(false);
    }
  }

  const validation = Yup.object().shape({
    new_email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
  });

  let requestEmailFormik = useFormik({
    initialValues: {
      new_email: "",
    },
    validationSchema: validation,
    onSubmit: requestChangeEmail,
  });

  let confirmEmailFormik = useFormik({
    initialValues: {
      new_email: "",
      code: "",
    },
    validationSchema: validation,
    onSubmit: confirmChangeEmail,
  });
  async function changeName(values) {
    setIsNameLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/auth/profile/update-name`,
        values,
        {
          headers: {
            "X-API-KEY": XApiKey,
            Authorization: localStorage.getItem("token"),
          },
        }
      );
       setEmailChange(false);
      toast.success(
        response?.data?.message ||
          `${
            lang === "en"
              ? "Name Changed successfully."
              : "تم تغيير الإسم بنجاح"
          }`,
        {
          duration: 2000,
          style: {
            background: "#10B981",
            color: "#fff",
            fontWeight: "500",
          },
        }
      );
      setChanged(Date.now());
    } catch (error) {
      console.error("Confirm Change Email Error:", error);
    } finally {
      setIsNameLoading(false);
    }
  }
  let changeNameFormik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: changeName,
  });
  async function changePassword(values) {
    setIsPasswordLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/auth/profile/update-password`,
        values,
        {
          headers: {
            "X-API-KEY": XApiKey,
            Authorization: localStorage.getItem("token"),
          },
        }
      );
       setEmailChange(false);
      toast.success(
        response?.data?.message ||
          `${
            lang === "en"
              ? "Password Changed successfully."
              : "تم تغيير كلمة المرور بنجاح"
          }`,
        {
          duration: 2000,
          style: {
            background: "#10B981",
            color: "#fff",
            fontWeight: "500",
          },
        }
      );
      setChanged(Date.now());
    } catch (error) {
   

      toast.error(
        error?.response.data?.message ||
          `${
            lang === "en"
              ? "Password Changed successfully."
              : "تم تغيير كلمة المرور بنجاح"
          }`
      );
      console.error("Password Change Email Error:", error);
    } finally {
      setIsPasswordLoading(false);
    }
  }
  let changePasswordFormik = useFormik({
    initialValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
    onSubmit: changePassword,
  });

  return (
    <>
      <div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">{t("profileDetails.title")}</h3>
          <p className="text-lg fot-bold">{t("profileDetails.subtitle")}</p>

          {/* Contact Info */}
          <form
            onSubmit={requestEmailFormik.handleSubmit}
            className="bg-third text-primary p-4 rounded-lg "
          >
            <h3 className="text-primary font-bold mt-3 mb-5">
              {t("profileDetails.contact.title")}
            </h3>

            <div className="flex gap-7   flex-col lg:flex-row">
              <div className="lg:w-4/12">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <MdEmail className="text-primary/50" size={20} />
                  </div>
                  <input
                    onChange={requestEmailFormik.handleChange}
                    value={requestEmailFormik.values.new_email}
                    onBlur={requestEmailFormik.handleBlur}
                    type="text"
                    name="new_email"
                    disabled={userData?.role == "admin"}
                    className="font-bold border py-4 border-gray-300 text-primary text-sm rounded-lg block w-full ps-10 p-2.5 bg-third placeholder-primary/50 disabled:!cursor-not-allowed disabled:bg-primary/20 disabled:text-third"
                    placeholder={`${userData?.email}`}
                  />
                </div>
              </div>

              {/* Phone Not Provided from API */}
              {/* <div className="lg:w-4/12">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <HiOutlinePhone className="text-primary/50" size={20} />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    className="font-bold border py-4 border-gray-300 text-primary text-sm rounded-lg block w-full ps-10 p-2.5 bg-third placeholder-primary/50"
                    placeholder={`${userData?.phone}`}
                  />
                </div>
              </div> */}
            </div>

            <div className="w-full flex justify-end">
              <button
                type="submit"
                disabled={userData?.role == "admin" || isLoading}
                className="p-3 mt-4 flex items-center gap-3 bg-primary/10 text-primary   rounded-lg disabled:!cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200"
              >
                {isLoading ? <FaCircleNotch className="animate-spin" /> : null}
                {t("profileDetails.contact.updateButton")}
              </button>
            </div>
          </form>

          {/* Personal Info */}
          <div className="bg-third text-primary p-4 rounded-lg">
            <h3 className="text-primary font-bold mt-3 mb-5">
              {t("profileDetails.personal.title")}
            </h3>

            <form
              onSubmit={changeNameFormik.handleSubmit}
              className="flex flex-col lg:flex-row"
            >
              <div className="w-full">
                <div className="relative  ">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <CgProfile className="text-primary/50" size={20} />
                  </div>
                  <input
                    disabled={isNameLoading}
                    onChange={changeNameFormik.handleChange}
                    value={changeNameFormik.values.name}
                    onBlur={changeNameFormik.handleBlur}
                    type="text"
                    name="name"
                    className="font-bold border py-4 border-gray-300 text-primary text-sm rounded-lg block w-full ps-10 p-2.5 bg-third placeholder-primary/50 disabled:!cursor-not-allowed disabled:bg-primary/20 disabled:text-third"
                    placeholder={t("profileDetails.personal.NamePlaceholder")}
                  />
                </div>
              </div>
              <div className="w-full flex justify-end lg:pt-10">
                <button
                  disabled={isNameLoading}
                  className="p-3 flex items-center gap-3 disabled:!cursor-not-allowed disabled:bg-primary/20 disabled:text-third mt-4 bg-primary/10 text-primary rounded-lg"
                >
                  {isNameLoading ? (
                    <FaCircleNotch className="animate-spin" />
                  ) : null}
                  {t("profileDetails.personal.updateButton")}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-third text-primary p-4 rounded-lg">
            <h3 className="text-primary font-bold mt-3 mb-5">
              {t("profileDetails.personal.password")}
            </h3>

            <form
              onSubmit={changePasswordFormik.handleSubmit}
              className=""
             >
              <div className="flex gap-7  flex-col lg:flex-row">

              <div className="lg:w-full  ">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <CgProfile className="text-primary/50" size={20} />
                  </div>
                  <input
                    onChange={changePasswordFormik.handleChange}
                    value={changePasswordFormik.values.current_password}
                    onBlur={changePasswordFormik.handleBlur}
                    type="password"
                    name="current_password"
                    className="font-bold border py-4 border-gray-300 text-primary text-sm rounded-lg block w-full ps-10 p-2.5 bg-third placeholder-primary/50"
                    placeholder={t("profileDetails.personal.currentPassword")}
                  />
                </div>
              </div>
              <div className="lg:w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <CgProfile className="text-primary/50" size={20} />
                  </div>
                  <input
                    onChange={changePasswordFormik.handleChange}
                    value={changePasswordFormik.values.password}
                    onBlur={changePasswordFormik.handleBlur}
                    type="password"
                    name="password"
                    className="font-bold border py-4 border-gray-300 text-primary text-sm rounded-lg block w-full ps-10 p-2.5 bg-third placeholder-primary/50"
                    placeholder={t("profileDetails.personal.newPassword")}
                  />
                </div>
              </div>
              <div className="lg:w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <CgProfile className="text-primary/50" size={20} />
                  </div>
                  <input
                    onChange={changePasswordFormik.handleChange}
                    value={changePasswordFormik.values.password_confirmation}
                    onBlur={changePasswordFormik.handleBlur}
                    type="password"
                    name="password_confirmation"
                    className="font-bold border py-4 border-gray-300 text-primary text-sm rounded-lg block w-full ps-10 p-2.5 bg-third placeholder-primary/50"
                    placeholder={t("profileDetails.personal.confirmPassword")}
                  />
                </div>
              </div>
              </div>
              <div className="w-full flex justify-between mt-5">
                 <Link
                   to="/forgot-password"
                  className="p-3 mt-4 w-2/12 justify-center bg-primary text-third rounded-lg flex items-center gap-3"
                >
                   
                  {t("profileDetails.personal.forgetPassword")}
                </Link>
                <button
                  type="submit"
                  className="p-3 mt-4 w-5/12 justify-center bg-primary/10 text-primary rounded-lg flex items-center gap-3"
                >
                  {isPasswordLoading ? (
                    <FaCircleNotch className="animate-spin" />
                  ) : null}
                  {t("profileDetails.personal.updatePasswordButton")}
                </button>
               
              </div>
            </form>
          </div>
        </div>
      </div>

      {emailChange ? (
        <div
          onClick={() => {
            setEmailChange(false);
          }}
          className="fixed inset-0 backdrop-blur-lg flex justify-center items-center"
        >
          <form
            onSubmit={confirmEmailFormik.handleSubmit}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className=" bg-third text-primary rounded-xl w-4/12 h-80 flex flex-col relative items-center gap-5 justify-center"
          >
            <h3 className="text-xl font-bold">
              {t("profileDetails.changeYourEmailAddress")}
            </h3>
            <input
              onChange={confirmEmailFormik.handleChange}
              value={confirmEmailFormik.values.new_email}
              onBlur={confirmEmailFormik.handleBlur}
              type="text"
              name="new_email"
              className="font-bold border py-4 border-gray-300 text-primary text-sm rounded-lg block w-5/12 p-2.5 bg-third placeholder-primary/50"
              placeholder={newEmail}
            />
            <input
              onChange={confirmEmailFormik.handleChange}
              value={confirmEmailFormik.values.code}
              onBlur={confirmEmailFormik.handleBlur}
              type="text"
              name="code"
              className="font-bold border py-4 border-gray-300 text-primary text-sm rounded-lg block w-5/12 p-2.5 bg-third placeholder-primary/50"
              placeholder={t("profileDetails.Code")}
            />

            <div
              onClick={() => {
                setEmailChange(false);
              }}
              className="absolute top-5 start-5 text-3xl cursor-pointer bg-red-500 hover:bg-red-800 duration-500 w-10 h-10 flex justify-center items-start rounded-full"
            >
              x
            </div>
            <div className="w-full flex justify-end mx-4">
              <button
                type="submit"
                className="p-3 mt-10 mx-4 bg-gray-600 text-primary rounded-lg flex gap-3 items-center"
              >
                {isConfirmLoading ? (
                  <FaCircleNotch className="animate-spin" />
                ) : null}

                {t("profileDetails.ChangeEmailButton")}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default Profile;
