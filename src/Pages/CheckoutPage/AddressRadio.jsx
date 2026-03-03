import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdNavigateNext, MdOutlineAddLocationAlt } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import AddAddressModal from "../../Components/AddAddressModal";
import { AddressContext } from "../../context/AddressContext";
import { CheckoutContext } from '../../context/CheckoutContext';
import { ApiAuthContext } from "../../context/AuthContext";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { FaRegTrashCan } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const AddressRadio = () => {
  const [isButtons, setIsButtons] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {addressChanged,setAddressChanged} = useContext(AddressContext)
  const { isSentC } = useContext(AddressContext);
  const { setAddressId: setCheckoutAddressId, setSelectedAddress: setCheckoutSelectedAddress } = useContext(CheckoutContext);
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [defaultChanged, setDefaultChanged] = useState(null);
  const { t } = useTranslation();

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
  });
  useEffect(() => {
    if (data) {
 
      setAddresses(data);
    }
  }, [data]);

  useEffect(() => {
    if (addresses && addresses.length > 0 && selectedAddress === null) {
      const defaultAddr = addresses.find((a) => a.set_default) || addresses[0];
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
        if (setCheckoutSelectedAddress) setCheckoutSelectedAddress(defaultAddr);
        if (setCheckoutAddressId) setCheckoutAddressId(defaultAddr.id);
       }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  useEffect(() => {
    if (!isSentC) {
      setIsButtons(false);
    }
  }, [isSentC]);

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
      toast.success(t('guestCheckout.Default address changed successfully'), {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "500",
        },
      });

      setDefaultChanged(id);
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
     }
  }
  async function DeleteAddress(id) {
    try {
      const response = await axios.delete(
        `${baseUrl}/auth/address/${id}`,

        {
          headers: {
            "X-API-KEY": XApiKey,
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      toast.success(t('guestCheckout.Address deleted successfully'), {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "500",
        },
      });

      setDefaultChanged(id);
      setAddressChanged(Date.now())
      
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
     }
  }
  return (
    <>
      <StyledWrapper  className="w-full">
        <div className="radio-inputs py-5 w-full !flex">
          <h3 className="text-2xl font-bold text-start  w-full">{t('guestCheckout.Ship to')} </h3>
          {selectedAddress === null ? (
            <>
              {(() => {
                const hasDefault = addresses.some((a) => a.set_default);
                const randomIndex = Math.floor(
                  Math.random() * addresses.length
                );

                return addresses.map((address, index) => {
                  const shouldShow = hasDefault
                    ? address.set_default
                    : index === randomIndex;

                  if (!shouldShow) return null;

                  return (
                    <label
                      key={address.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsButtons(true);
                        if (setCheckoutSelectedAddress) setCheckoutSelectedAddress(address);
                        if (setCheckoutAddressId) setCheckoutAddressId(address.id);
                      }}
                      className="w-full"
                    >
                      <input
                        name="addressD"
                        type="radio"
                        checked={true}
                        className="radio-input"
                      />
                      <span className="radio-tile w-full h-20 !flex !items-center gap-4">
                        <div className="w-full h-20 !flex !items-center gap-4">
                          <span className="radio-icon">
                            <HiOutlineLocationMarker size={30} />
                          </span>
                          <div>
                            <p>{address.address}</p>
                          </div>
                        </div>
                        {address.set_default && (
                          <div className="mx-3 flex items-center gap-3">
                            <h3>{t('guestCheckout.Default')}</h3>
                            <MdNavigateNext size={30} />
                          </div>
                        )}
                      </span>
                    </label>
                  );
                });
              })()}
            </>
          ) : (
            <label
             
              onClick={(e) => {
                e.stopPropagation();
                setIsButtons(true);
              }}
              className="w-full"
            >
              <input
                name="selected"
                type="radio"
                checked={true}
                className="radio-input"
              />
              <span className="radio-tile w-full h-20 !flex !items-center gap-4">
                <div className="w-full h-20 !flex !items-center gap-4">
                  <span className="radio-icon">
                    <HiOutlineLocationMarker size={30} />
                  </span>
                  <div>
                    <p>{selectedAddress.address}</p>
                  </div>
                </div>
                {selectedAddress.set_default ? (
                  <div className="mx-3 flex items-center gap-3">
                    <h3>Default</h3>
                    <MdNavigateNext size={30} />
                  </div>
                ) : null}
              </span>
            </label>
          )}

          {/* {selectedAddress === null ? (
            <>
              {addresses.map((address, index) => {
                 const randomIndex = Math.floor(
                  Math.random() * addresses.length
                );

                return (
                  <>
                    <label
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsButtons(true);
                      }}
                      className={`  w-full   ${
                        address.set_default || index == randomIndex ? " " : "hidden"
                      }`}
                    >
                      <input
                        name="addressD"
                        type="radio"
                        checked={address.set_default}
                        className="radio-input"
                      />
                      <span className="radio-tile w-full h-20  !flex !items-center gap-4">
                        <div className=" w-full h-20  !flex !items-center gap-4 ">
                          <span className="radio-icon">
                            <HiOutlineLocationMarker size={30} />
                          </span>
                          <div>
                            <p> {address.address}</p>
                          </div>
                        </div>
                        {address.default ? (
                          <div className="mx-3 flex items-center gap-3">
                            <h3>Default</h3>
                            <MdNavigateNext size={30} />
                          </div>
                        ) : null}
                      </span>
                    </label>
                  </>
                );
              })}
            </>
          ) : (
            <label
              onClick={(e) => {
                e.stopPropagation();
                setIsButtons(true);
              }}
              className={`  w-full   `}
            >
              <input
                name="selected"
                type="radio"
                checked={true}
                className="radio-input"
              />
              <span className="radio-tile w-full h-20  !flex !items-center gap-4">
                <div className=" w-full h-20  !flex !items-center gap-4 ">
                  <span className="radio-icon">
                    <HiOutlineLocationMarker size={30} />
                  </span>
                  <div>
                    <p> {selectedAddress.address}</p>
                  </div>
                </div>
                {selectedAddress.set_default ? (
                  <div className="mx-3 flex items-center gap-3">
                    <h3>Default</h3>
                    <MdNavigateNext size={30} />
                  </div>
                ) : null}
              </span>
            </label>
          )} */}
        </div>
     <>
      <div key={addressChanged}>
           {addresses.length < 1 && (
          <div className="!mb-5 ">
            <label
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className={`  w-full    cursor-pointer`}
             >
              <span className="border rounded-2xl border-dashed  w-full h-20  !flex !items-center gap-4">
                <div className=" w-full h-20  !flex !items-center gap-4 ">
                  <span className="radio-icon">
                    <FaPlus size={30} />
                  </span>
                  <div>
                    <p className="font-bold">{t('guestCheckout.Add Address')}</p>
                  </div>
                </div>
              </span>
            </label>
          </div>
        )}
      </div>
     </>
      </StyledWrapper>
      <AnimatePresence>
        {isButtons && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 py-30 z-10 backdrop-blur-2xl "
            onClick={(e) => {
              setIsButtons(false);
            }}
          >
            <StyledWrapper>
              <div className="radio-inputs py-5 !flex  ">
                <h3 className="text-2xl font-bold">{t('guestCheckout.Saved Addresses')}</h3>
                <div className="  overflow-y-scroll max-h-[60vh] lg:w-[70%] w-full px-25">
                  {addresses.map((address) => (
                    <>
                      <motion.label
                        key={address.id ?? address.address}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAddress(address);
                                  if (setCheckoutAddressId) setCheckoutAddressId(address.id);
                                  setIsButtons(false);
                                }}
                        className={`!w-2/12 m-1 ${
                          address.default ? "order-0" : "order-1"
                        }`}
                      >
                        <input
                          name="address"
                          type="radio"
                          className="radio-input"
                        />
                        <span className="radio-tile w-full h-fit max-h-40 min-h-40 lg:max-h-20 lg:min-h-20 !flex !items-center gap-4">
                          <div className="w-full   !flex !items-center gap-4 ">
                            <span className="radio-icon">
                              <HiOutlineLocationMarker size={30} />
                            </span>
                            <div>
                              <span>{address.type}</span>
                              <p>{address.address}</p>
                            </div>
                          </div>
                          {address.set_default ? (
                            <div className="w-2/12 flex justify-center mx-3">
                              <h3>{t('guestCheckout.Default')}</h3>
                            </div>
                          ) : (
                            <div className="flex w-4/12">
                              <div
                                className="   bg-third  text-primary mx-1 py-2 rounded-lg w-8/12  flex justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDefault(address.id);
                                }}
                              >
                                <h3>{t('guestCheckout.Set Default')}</h3>
                              </div>
                              <div
                                className="  bg-red-800 text-white mx-3 py-2 rounded-lg  w-4/12 flex justify-center items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  DeleteAddress(address.id);
                                }}
                              >
                                <div>
                                  <FaRegTrashCan />
                                </div>
                              </div>
                            </div>
                          )}
                        </span>
                      </motion.label>
                    </>
                  ))}
                </div>
              </div>
            </StyledWrapper>
            <div className="w-full flex justify-center ">
              <button
                onClick={(e) => {
                  setShowModal(true), e.stopPropagation();
                }}
                className="p-3 mt-4 bg-gray-600 text-white rounded-lg font-bold cursor-pointer flex gap-2 items-center"
              >
                <MdOutlineAddLocationAlt size={22} />
                {t('guestCheckout.Add New Address')}
              </button>
            </div>
          </motion.div>
        )}
        <AnimatePresence className="relative">
          {showModal && !isSentC && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center   bg-opacity-50"
              style={{ backdropFilter: "blur(10px)" }}
              onClick={() => setShowModal(false)}
            >
              <AddAddressModal />
            </div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </>
  );
};

const StyledWrapper = styled.div`
  .radio-inputs {
    display: flex;
    flex-direction: column; /* Stack elements vertically */
    justify-content: center;
    align-items: center;
    max-width: 100%; /* Ensure it doesn't overflow */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .radio-inputs > * {
    margin: 10px 0; /* Add vertical spacing between options */
  }

  .radio-input:checked + .radio-tile {
    border-color: #253333;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    color: #253333;
  }

  .radio-input:checked + .radio-tile:before {
    transform: scale(1);
    opacity: 1;
    background-color: #253333;
    border-color: #253333;
  }

  .radio-input:checked + .radio-tile .radio-icon svg {
    // fill: #253333;
  }

  .radio-input:checked + .radio-tile .radio-label {
    color: #253333;
  }

  .radio-input:focus + .radio-tile {
    border-color: #253333;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1), 0 0 0 2px;
  }

  .radio-input:focus + .radio-tile:before {
    transform: scale(1);
    opacity: 1;
  }

  .radio-tile {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    border-radius: 25px; /* Full pill shape */
    border: 2px solid #b5bfd9;
    background-color: #fff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    transition: 0.15s ease;
    cursor: pointer;
    position: relative;
    padding-left: 50px; /* Space for the indicator */
  }

  .radio-tile:before {
    content: "";
    position: absolute;
    display: block;
    width: 20px; /* Size of the indicator */
    height: 20px; /* Size of the indicator */
    border: 2px solid #b5bfd9;
    background-color: #fff;
    border-radius: 50%; /* Circle shape for the indicator */
    left: 15px; /* Position of the indicator */
    transition: 0.25s ease;
  }

  .radio-tile:hover {
    border-color: #253333;
  }

  .radio-tile:hover:before {
    transform: scale(1);
    opacity: 1;
  }

  .radio-icon {
    margin-left: 10px; /* Space between the indicator and icon */
  }

  .radio-icon svg {
    // width: 1.5rem;
    // height: 1.5rem;
    // fill: bla;
  }

  .radio-label {
    color: #707070;
    transition: 0.375s ease;
    text-align: left; /* Align text to the left */
    font-size: 13px;
    margin-left: 10px; /* Space between the icon and label */
  }

  .radio-input {
    clip: rect(0 0 0 0);
    -webkit-clip-path: inset(100%);
    clip-path: inset(100%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;

export default AddressRadio;
