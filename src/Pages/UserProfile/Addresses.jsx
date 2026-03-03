import React, { useContext, useEffect, useRef, useState } from "react";
import { BsMailbox } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlinePhone } from "react-icons/hi";
import { MdContactPage } from "react-icons/md";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as yup from "yup";
import AddAddressModal from "../../Components/AddAddressModal";
import { ApiAuthContext } from "../../context/AuthContext";
import { AddressContext } from "../../context/AddressContext";
import { useQuery } from "@tanstack/react-query";
import { AddressesContext } from "../../context/GetAddresses";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Addresses = () => {
  const [showModal, setShowModal] = useState(false);
  const { addresses,setDefaultChanged } = useContext(AddressesContext);
  const { t } = useTranslation();
    const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  
    async function setDefault(id) {
    try {
      const response = await axios.put(
        `${baseUrl}/auth/address/set-default/${id}`,
        { id },
        {
          headers: {
            "X-API-KEY": XApiKey,
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      toast.success("Default address changed successfully", {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "500",
        },
      });

      setDefaultChanged(Date.now());
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
      } else if (error.request) {
        console.error("No Response:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    } finally {
      console.log("Request finished (success or error).");
    }
  }

  async function handleAddAddress(values) {
    console.log(values);
  }

  let addFormik = useFormik({
    initialValues: {
      fullAddress: "",
      state: "",
      city: "",
    },
    onSubmit: handleAddAddress,
  });
  return (
    <>
      <div>
        <h3 className="text-xl font-bold">{t('profile.Addresses')}</h3>
        <p className="text-lg fot-bold">{t('profile.Manage your saved addresses')}</p>
        <div className="w-full flex ">
          <button
            onClick={() => setShowModal(true)}
            className="p-3 mt-4 bg-third text-primary rounded-lg font-bold cursor-pointer flex gap-2 items-center"
          >
            <MdOutlineAddLocationAlt size={22} />
            {t('profile.Add New Address')}
          </button>
        </div>
        <h3 className="  font-bold mt-3 mb-5">
          {t('profile.Default Address')}
        </h3>
        {addresses.map((address) =>
          address.set_default === 1 ? (
            <div className=" bg-third  text-primary p-4 rounded-lg my-4">
              <h3 className="  font-bold mt-3 mb-5">
                {t('profile.Home')}
              </h3>

              {/* <div className="flex my-2 items-center gap-2">
                <BsMailbox size={20} />
                <span className="font-bold w-3/12">Email:</span>
                <p>mario2012magdy@hotmail.com</p>
              </div> */}

              <div className="flex my-2 items-center gap-2">
                <HiOutlinePhone size={20} />
                <span className="font-bold w-3/12">{t('profile.Phone')}:</span>
                <p>{address.phone}</p>
              </div>
              <div className="flex my-2 items-center gap-2">
                <HiOutlineLocationMarker size={20} />
                <span className="font-bold w-3/12">{t('profile.Address')}:</span>
                <p>{address.address}</p>
              </div>

              <div className="w-full flex justify-end">
                <button className="p-3 mt-4 bg-primary/20 rounded-full text-primary   cursor-pointer ">
                  <FaRegEdit size={25} style={{ padding: 1 }} />
                </button>
              </div>
            </div>
          ) : null
        )}

        <h3 className="  font-bold mt-3 mb-5">
          {t('profile.Other Addresses')}
        </h3>
        {/* <div className=" bg-third  text-primary text-white p-4 rounded-lg my-4">
          <h3 className="  font-bold mt-3 mb-5">Office</h3>

          <div className="flex my-2 items-center gap-2">
            <BsMailbox size={20} />
            <span className="font-bold w-3/12">Email:</span>
            <p>mario2012magdy@hotmail.com</p>
          </div>

          <div className="flex my-2 items-center gap-2">
            <HiOutlinePhone size={20} />
            <span className="font-bold w-3/12">Phone:</span>
            <p>+201287612642</p>
          </div>
          <div className="flex my-2 items-center gap-2">
            <HiOutlineLocationMarker size={20} />
            <span className="font-bold w-3/12">Address:</span>
            <p>Shoubra, Cairo, Egypt</p>
          </div>

          <div className="w-full flex justify-end">
            <button className="p-3 mt-4 bg-gray-600 rounded-full text-white   cursor-pointer ">
              <FaRegEdit size={25} style={{ padding: 1 }} />
            </button>
          </div>
        </div> */}
        {addresses.map((address) =>
          address.set_default !== 1 ? (
            <div className=" bg-third  text-primary p-4 rounded-lg my-4">
              <h3 className="  font-bold mt-3 mb-5">
                {t('profile.Home')}
              </h3>

              {/* <div className="flex my-2 items-center gap-2">
                <BsMailbox size={20} />
                <span className="font-bold w-3/12">Email:</span>
                <p>mario2012magdy@hotmail.com</p>
              </div> */}

              <div className="flex my-2 items-center gap-2">
                <HiOutlinePhone size={20} />
                <span className="font-bold w-3/12">{t('profile.Phone')}:</span>
                <p>{address.phone}</p>
              </div>
              <div className="flex my-2 items-center gap-2">
                <HiOutlineLocationMarker size={20} />
                <span className="font-bold w-3/12">{t('profile.Address')}:</span>
                <p>{address.address}</p>
              </div>

              <div className="flex items-center w-full justify-between ">
                <div className=" flex justify-end">
                  <button className="p-3 mt-4 bg-gray-600 rounded-full text-white   cursor-pointer ">
                    <FaRegEdit size={25} style={{ padding: 1 }} />
                  </button>
                </div>
                <div className=" flex justify-end">
                  <button
                    onClick={()=>{
                      setDefault(address.id)
                    }}
                  className="p-3 mt-4 bg-gray-600 rounded-full text-white   cursor-pointer ">
                    {t('profile.Set Default')}
                   </button>
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
      <AnimatePresence className="relative">
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center   bg-opacity-50"
            style={{ backdropFilter: "blur(10px)" }}
            onClick={() => setShowModal(false)}
          >
            <AddAddressModal />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Addresses;
