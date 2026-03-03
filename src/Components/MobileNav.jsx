import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiX,
  FiMenu,
  FiPackage,
  FiTag,
  FiShoppingCart,
  FiTruck,
} from "react-icons/fi";
import { MdCompareArrows } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useCartUI } from "../context/useCartUI";
import { userContext } from "../context/userContext";
import Dropdown from "./Dropdown";
import { ApiAuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../context/Settings";
import { Wishlist } from "../context/GetWishList";
import { useCompare } from "../context/CompareContext";
import { Cart } from "../context/GetCartContext";
import { RiPagesFill } from "react-icons/ri";
import { IoHome } from "react-icons/io5";
import { PiInfoBold } from "react-icons/pi";
import { LuRefreshCcw } from "react-icons/lu";
const MobileNav = () => { 
  const [isOpen, setIsOpen] = useState(false);
  const { openCart } = useCartUI();
  const { mainLogo } = useContext(SettingsContext);
  const { counter, setChanged } = useContext(Wishlist);
  const { compareList } = useCompare();
  const { cartCounter, cart, setToken } = useContext(Cart);

  const { isLogged, setIsLogged } = useContext(userContext);
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { t, i18n } = useTranslation();
  const currentLangIsArabic = i18n.language?.startsWith("ar");

  async function handleLogout() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${baseUrl}/auth/logout`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": XApiKey,
              Authorization: token,
            },
          }
        );
      }
    } catch {
      // ignore and proceed with local logout
    } finally {
      localStorage.removeItem("token");
      setIsLogged(false);
      toast.dismiss();
      toast.success(t("navigation.authItems.loggedOutSuccess"), {
        duration: 2000,
        style: { background: "#10B981", color: "#fff", fontWeight: "500" },
      });
    }
  }

  function toggleLanguage() {
    const next = currentLangIsArabic ? "en" : "ar";
    i18n.changeLanguage(next);
    try {
      localStorage.setItem("lang", next);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    }
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Shop dropdown items for mobile
  const shopItems = [
    {
      name: t("navigation.shopItems.allProducts.name"),
      path: t("navigation.shopItems.allProducts.path"),
      icon: <FiPackage size={18} className="ml-2" />,
    },
    {
      name: t("navigation.shopItems.newArrivals.name"),
      path: t("navigation.shopItems.newArrivals.path"),
      icon: <FiTag size={18} className="ml-2" />,
    },
    {
      name: t("navigation.shopItems.bestSellers.name"),
      path: t("navigation.shopItems.bestSellers.path"),
      icon: <FiShoppingCart size={18} className="ml-2" />,
    },
    {
      name: t("navigation.shopItems.saleItems.name"),
      path: t("navigation.shopItems.saleItems.path"),
      icon: <FiTag size={18} className="ml-2" />,
    },
  ];

  // Pages dropdown items for mobile
  const pagesItems = [
    {
      name: t("navigation.pagesItems.aboutUs.name"),
      path: t("navigation.pagesItems.aboutUs.path"),
      icon: <FiPackage size={20}  />,
    },
    {
      name: t("navigation.pagesItems.contact.name"),
      path: t("navigation.pagesItems.contact.path"),
      icon: <FiTruck size={20}  />,
    },
    {
      name: t("navigation.pagesItems.blog.name"),
      path: t("navigation.pagesItems.blog.path"),
      icon: <FiTag size={20}  />,
    },
  ];

  // Auth dropdown items for mobile
  const authItems = [
    {
      name: t("navigation.authItems.login"),
      path: "/login",
      icon: <RiLoginCircleFill size={18} className="ml-2" />,
    },
    {
      name: t("navigation.authItems.register"),
      path: "/register",
      icon: <AiOutlineUserAdd size={18} className="ml-2" />,
    },
  ];

  const userItems = [
    {
      name: t("navigation.authItems.profile"),
      path: "/userprofile",
      icon: <FaUserCircle size={18} className="ml-2" />,
    },
    {
      name: t("navigation.authItems.logout"),
      path: "/login",
      icon: <RiLoginCircleFill size={18} className="ml-2" />,
      danger: true,
      fn: handleLogout,
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-transparent">
        {/* Main Mobile Nav */}
        <div className="flex items-center justify-between px-4 py-4">
          {/* Hamburger Menu */}
          <button
            onClick={toggleSidebar}
            className="  bg-primary h-full p-2 w-15 flex items-center justify-center rounded-xl shadow-secondary shadow-md text-third hover:text-gray-900 transition-colors"
          >
            {isOpen ? <FiX className="h-[60px] text-2xl" /> : <FiMenu className="h-[60px] text-2xl" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center bg-primary p-2 rounded-xl shadow-secondary shadow-md">
            <div className="h-[60px] w-65 flex justify-center">
              {mainLogo ? (
                <img src={mainLogo} alt="Joot Bag" className="h-full" />
              ) : null}
            </div>
          </Link>

          {/* Action Icons */}
          <div className="flex   p-2 items-center gap-2 bg-primary px-3 py-2 rounded-xl shadow-secondary shadow-md">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-third hover:opacity-80 transition-opacity"
              aria-label="Toggle language"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded bg-third text-primary text-[12px] leading-5 text-center">
                {currentLangIsArabic ? "AR" : "EN"}
              </span>
            </button>
            <button
              onClick={() => window.dispatchEvent(new Event("open-search"))}
              className="p-2 text-third hover:opacity-80 transition-opacity"
            >
              <FiSearch className="h-[40px] text-2xl"  />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-primary shadow-xl transform transition-transform duration-300 ease-in-out z-70 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-third/20">
          <div className="flex">
            {mainLogo ? (
              <img src={mainLogo} alt="Joot Bag" className="w-35" />
            ) : null}
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 text-third hover:opacity-80 transition-opacity"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4">
          <div className="flex items-center justify-center gap-4 mb-4 bg-white/5 backdrop-blur-sm p-3 rounded-xl">
            <Link
              onClick={closeSidebar}
              to="/wishlist"
              className="p-2 text-third relative transition-opacity hover:opacity-80"
            >
              <div
                key={cart}
                className="absolute w-[13px] h-[13px] text-[10px] rounded-full start-6 top-0 bg-third text-primary flex items-center justify-center"
              >
                {counter}
              </div>
              <FiHeart size={20} />
            </Link>
            <button
              onClick={() => {
                openCart();
                closeSidebar();
              }}
              className="p-2 text-third relative transition-opacity hover:opacity-80"
            >
              <div className="absolute w-[13px] h-[13px] text-[10px] rounded-full start-6 top-0 bg-third text-primary flex items-center justify-center">
                {cartCounter}
              </div>
              <FiShoppingBag size={20} />
            </button>
            <Link
              onClick={closeSidebar}
              to="/compare"
              className="p-2 text-third relative transition-opacity hover:opacity-80"
            >
              <div className="absolute w-[13px] h-[13px] text-[10px] rounded-full start-6 top-0 bg-third text-primary flex items-center justify-center">
                {compareList?.length || 0}
              </div>
              <LuRefreshCcw size={20} />
            </Link>
          </div>
          
          <div className="w-full mb-3">
            <Dropdown
              title={
                isLogged ? (
                  <div className="flex gap-3 items-center">
                    <FaUserCircle size={20} />
                    {t("navigation.menu.account")}
                  </div>
                ) : (
                  <div className="flex gap-3 items-center">
                    <FaUserCircle size={20} />
                    {t("navigation.menu.loginRegister")}
                  </div>
                )
              }
              items={isLogged ? userItems : authItems}
              isMobile={true}
              onItemClick={closeSidebar}
            />
          </div>
          
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="block py-3 px-4 text-third font-bold hover:bg-white/10 rounded-xl transition-colors"
                onClick={closeSidebar}
              >
                <div className="flex gap-3 items-center">
                  <IoHome size={20} />
                  {t("navigation.menu.home")}
                </div>
              </Link>
            </li>

            <li>
              <Dropdown
                title={
                  <div className="flex gap-3 items-center">
                    <FiShoppingBag size={20} />
                    {t("navigation.menu.shop")}
                  </div>
                }
                items={shopItems}
                isMobile={true}
                onItemClick={closeSidebar}
              />
            </li>

            {pagesItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="block py-3 px-4 text-third font-bold hover:bg-white/10 rounded-xl transition-colors"
                  onClick={closeSidebar}
                >
                  <div className="flex gap-3 items-center">
                    {item.icon}
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
