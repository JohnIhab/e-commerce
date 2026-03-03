import React, { useContext, useEffect, useState } from "react";
// import mac from "../../assets/profile/orders/mac.png";
// import iphone from "../../assets/profile/orders/iphone.png";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa6";
import { MdOutlineCompareArrows } from "react-icons/md";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "../../Components/Loader";
import { addToWishListContext } from "../../context/AddToWishListContext";
import AddLoader from "../../Components/AddLoader";
import { useTranslation } from "react-i18next";
import { Wishlist } from "../../context/GetWishList";
import emptyWish from "../../assets/Cart/wishEmpty.jpg";
import { addToCartContext } from "../../context/AddToCartContext";
import { Cart } from "../../context/GetCartContext";
import { useCartUI } from "../../context/useCartUI";
import { useCompare } from "../../context/CompareContext";
const WishList = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { WishList, isLoading, setChanged } = useContext(Wishlist);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [cartLoadingId, setCartLoadingId] = useState(null);
  const [compareLoadingId, setCompareLoadingId] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const { addToCart } = useContext(addToCartContext);
  const { setChanged: setCartChanged } = useContext(Cart);
  const { openCart } = useCartUI();


    const {
      compareList = [],
      addToCompare,
      removeFromCompare,
      setComparechanged,
    } = useCompare();

  async function deleteWishlist(id) {
    setDeleteLoadingId(id);
    try {
      const response = await axios.delete(`${baseUrl}/auth/wishlist/${id}`, {
        headers: {
          "X-API-KEY": XApiKey,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success(
        response?.data?.message ||
          t("wishList.Product has been deleted successfully"),
        {
          duration: 2000,
          style: {
            background: "#10B981",
            color: "#fff",
            fontWeight: "500",
          },
        }
      );

      setChanged(id);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setDeleteLoadingId(null);
    }
  }

  // async function deleteWishlist(id) {
  //   setDeleteLoading(true);
  //   try {
  //     const response = await axios.delete(`${baseUrl}/auth/wishlist/${id}`, {
  //       headers: {
  //         "X-API-KEY": XApiKey,
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     toast.success(data?.message || "Product has been deleted Succesfully", {
  //       duration: 2000,
  //       style: {
  //         background: "#10B981",
  //         color: "#fff",
  //         fontWeight: "500",
  //       },
  //     });
  //     setChanged(id);
  //     setDeleteLoading(false);
  //   } catch (error) {
  //     setDeleteLoading(false);
  //     toast.error(error.message || "Something went wrong");
  //   }
  // }

  if (WishList.length < 1) {
    return (
      <div className="py-20 mx-auto flex animation-[pulse_2s_ease-in-out_infinite] items-center justify-center opacity-50 text-center text-2xl font-bold">
        <img src={emptyWish} alt="" />
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="mx-2 sm:mx-4 md:mx-8 lg:mx-10 flex flex-wrap p-2 sm:p-4 rounded-lg my-4">
        {WishList?.map((wish) => (
          <div
            key={wish.id}
            className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 flex justify-between mb-4"
          >
            <div className="flex flex-col sm:flex-row shadow-md w-full mx-0 sm:mx-2 p-2 sm:justify-between items-center px-2 rounded-lg border-gray-500 bg-gradient-to-b from-gray-300">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto">
                <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] flex items-center justify-center mb-2 sm:mb-0">
                  <img
                    src={wish.product.banner_en}
                    className="object-contain w-full h-full"
                    alt=""
                  />
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-start">
                  <h3 className="font-bold text-base sm:text-xl">
                    {lang === "en"
                      ? wish?.product?.brand?.title_en
                      : wish?.product?.brand?.title_ar ??
                        wish?.product?.brand?.title_en}
                  </h3>
                  <p className="text-sm sm:text-lg">
                    {lang === "en"
                      ? wish.product.title_en
                      : wish.product.title_ar ?? wish.product.title_en}
                  </p>
                  <p className="text-sm sm:text-lg">
                    {wish.product.unit_price}
                  </p>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 sm:gap-5 my-2 sm:my-0 items-center justify-center sm:items-end">
                
                {compareLoadingId === wish.id ? (
                  <div className="bg-[#3c5353] p-3 text-white w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] rounded-full flex items-center justify-center cursor-pointer">
                    <AddLoader />
                  </div>
                ) : (
                  <div
                    onClick={async () => {
                      const existing = compareList.find(
                        (item) => item.product?.id === wish.product.id
                      );
                      try {
                         setCompareLoadingId(wish.id)
                        if (existing) {
                          await removeFromCompare(existing.id);
                        } else {
                          await addToCompare(wish.product.id);
                          setComparechanged(Date.now());
                        }
                      } catch (err) {
                        // error handled by context toasts
                        console.error(err);
                      } finally {
                        setIsComparing(false);
                        setCompareLoadingId(null)
                      }
                    }}
                    className="bg-[#3c5353] p-3 text-white w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <MdOutlineCompareArrows
                      size={22}
                      className="sm:size-[25px] "
                    />
                  </div>
                )}
                {cartLoadingId === wish.id ? (
                  <div className="bg-[#3c5353] p-3 text-white w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] rounded-full flex items-center justify-center cursor-pointer">
                    <AddLoader />
                  </div>
                ) : (
                  <div
                    onClick={async () => {
                      setCartLoadingId(wish.id);
                      await addToCart(wish.product.id);
                      await setCartChanged(wish.product.id);
                      setCartLoadingId(null);
                      openCart();
                    }}
                    className="bg-[#3c5353] p-3 text-white w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <FaCartPlus
                      size={22}
                      className="sm:size-[25px]"
                      style={{ padding: 1 }}
                    />
                  </div>
                )}
                {deleteLoadingId === wish.id ? (
                  <div className="bg-red-700 p-3 text-white w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] rounded-full flex items-center justify-center cursor-pointer">
                    <AddLoader />
                  </div>
                ) : (
                  <div
                    onClick={async () => deleteWishlist(wish.id)}
                    className="bg-red-700 p-3 text-white w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <FaRegTrashCan
                      size={22}
                      className="sm:size-[25px]"
                      style={{ padding: 1 }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default WishList;
