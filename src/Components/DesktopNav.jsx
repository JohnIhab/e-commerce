import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
// import { Dropdown, DropdownItem } from "flowbite-react";
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiShoppingCart,
  FiPackage,
  FiTag,
  FiTruck,
} from "react-icons/fi";
import Dropdown from "./Dropdown";
import { useCartUI } from "../context/useCartUI";
// import logo from "../assets/Home/Logo_Header.jpg";
import { MdCompareArrows } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import { AiOutlineUserAdd } from "react-icons/ai";
import { userContext } from "../context/userContext";
import { ApiAuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../context/Settings";
import { BiCategory } from "react-icons/bi";
import { Wishlist } from "../context/GetWishList";
import { useCompare } from "../context/CompareContext";
import { Cart } from "../context/GetCartContext";
import { LuRefreshCcw } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { CategoriesContext } from "../context/CategoriesContext";


const DesktopNav = () => {
  // Shop dropdown items
  const location = useLocation();

  const { counter, setChanged } = useContext(Wishlist);
  const { compareList, setComparechanged } = useCompare();
  const { cartCounter, cart, setToken } = useContext(Cart);

  const { isLogged, setIsLogged } = useContext(userContext);
  const { mainLogo } = useContext(SettingsContext);

  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { t, i18n } = useTranslation();
  const currentLangIsArabic = i18n.language?.startsWith("ar");

  const paths = ["/new-arrival", "/Shop", "/categories", "/best-seller"];

  const isActive = paths.some((p) => location.pathname.startsWith(p));
  const { categories } = useContext(CategoriesContext);

  function toggleLanguage() {
    const next = currentLangIsArabic ? "en" : "ar";
    i18n.changeLanguage(next);
    try {
      localStorage.setItem("lang", next);
    } catch {
      // ignore storage errors
    }
    if (typeof document !== "undefined") {
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    }
  }

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
      setChanged(Date.now());
      setToken(token);
      setComparechanged(Date.now());
    } catch {
      // ignore failures, proceed with local logout
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

  const shopItems = [
    {
      name: t("navigation.shopItems.allProducts.name"),
      path: t("navigation.shopItems.allProducts.path"),
      icon: <FiPackage size={18} />,
      description: t("navigation.shopItems.allProducts.description"),
    },
    {
      name: t("navigation.shopItems.Categories.name"),
      path: "/categories",
      icon: <BiCategory size={18} />,
      description: t("navigation.shopItems.Categories.description"),
      children: categories.map((category) => ({
      name: category.title_en,
      path: `/categories/${category.slug_en}`,
    })),
    },

    {
      name: t("navigation.shopItems.newArrivals.name"),
      path: "new-arrival",
      icon: <FiTag size={18} />,
      description: t("navigation.shopItems.newArrivals.description"),
    },
    {
      name: t("navigation.shopItems.bestSellers.name"),
      path: "best-seller",
      icon: <FiShoppingCart size={18} />,
      description: t("navigation.shopItems.bestSellers.description"),
    },
  ];

  const Authitems = [
    {
      name: t("navigation.authItems.login"),
      path: "/login",
      icon: <RiLoginCircleFill size={18} />,
    },
    {
      name: t("navigation.authItems.register"),
      path: "/register",
      icon: <AiOutlineUserAdd size={18} />,
    },
  ];
  const userItems = [
    {
      name: t("navigation.authItems.logout"),
      path: "/login",
      fn: handleLogout,
      danger: true,
      icon: <RiLoginCircleFill size={18} />,
    },
    {
      name: t("navigation.authItems.profile"),
      path: "/userprofile",
      icon: <AiOutlineUserAdd size={18} />,
    },
  ];

  // Pages dropdown items

  const { openCart } = useCartUI();

  return (
    <div className="hidden lg:block  ">
      {/* Top Bar */}
      {/* <div className="bg-gray-800  text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <span>{t("navigation.topBar.promo")}</span>
            <div className="flex space-x-6">
              <span className="hover:text-gray-300 cursor-pointer transition-colors">
                {t("navigation.topBar.todaysDeal")}
              </span>
              <span className="hover:text-gray-300 cursor-pointer transition-colors">
                {t("navigation.topBar.customerService")}
              </span>
              <span className="hover:text-gray-300 cursor-pointer transition-colors">
                {t("navigation.topBar.giftCertificates")}
              </span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Navigation */}
      <div className="    bg-tranparent ">
        <div className="  mx-auto      ">
          <div className="flex items-center justify-center gap-5 pt-4  ">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center bg-primary p-2 rounded-xl shadow-secondary shadow-md "
            >
              {mainLogo ? (
                <img src={mainLogo} alt="Joot Bag" className="h-[55px]" />
              ) : null}
            </Link>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-20 font-bold bg-primary p-5 rounded-xl shadow-secondary shadow-md">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? ` text-primary bg-third p-1 rounded-md`
                    : `  text-third font-bold transition-colors `
                }
              >
                {t("navigation.menu.home")}
              </NavLink>
              <Dropdown
                // textColor={isActive ? "text-primary" : "text-third"}
                bgColor={isActive ? "shadow-third shadow-xl" : "bg-primary"}
                className="w-full flex items-center justify-between py-3 px-4 font-bold rounded-md transition-colors  "
                title={t("navigation.menu.shop")}
                items={shopItems}
              ></Dropdown>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? ` text-primary bg-third p-1 rounded-md`
                    : `  text-third font-bold transition-colors `
                }
              >
                {t("navigation.menu.about")}
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? ` text-primary bg-third p-1 rounded-md`
                    : `  text-third font-bold transition-colors `
                }
              >
                {t("navigation.pagesItems.contact.name")}
              </NavLink>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  isActive
                    ? ` text-primary bg-third p-1 rounded-md`
                    : `  text-third font-bold transition-colors `
                }
              >
                {t("navigation.pagesItems.blog.name")}
              </NavLink>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-6 bg-primary px-3 py-4 rounded-xl shadow-secondary shadow-md">
              <button
                onClick={toggleLanguage}
                className="hidden md:inline-flex items-center gap-2   rounded-xl   border-gray-300 text-sm font-semibold  text-third hover:bg-gray-50 transition-colors"
                aria-label="Toggle language"
              >
                <span className="  w-6 h-6 rounded bg-third flex items-center justify-center text-primary text-[12px] leading-5 text-center">
                  {currentLangIsArabic ? "AR" : "EN"}
                </span>
              </button>
              <Dropdown
                className="cursor-pointer"
                title={<FaUserCircle size={30} />}
                items={isLogged ? userItems : Authitems}
              />
              <button
                onClick={() => window.dispatchEvent(new Event("open-search"))}
                className="p-2 text-third  transition-colors cursor-pointer"
              >
                <FiSearch size={20} />
              </button>
              <Link
                to="/compare"
                className="p-2 text-third relative transition-colors curpo"
              >
                <div className="absolute w-[13px] h-[13px] text-[12px] rounded-full start-6 top-1 bg-third text-primary flex items-center justify-center">
                  {compareList?.length || 0}
                </div>
                <LuRefreshCcw size={25} />
              </Link>
              <Link
                to="/wishlist"
                className="p-2 text-third relative transition-colors"
              >
                <div
                  key={cart}
                  className="absolute w-[13px]  h-[13px]  text-[12px] rounded-full start-6 top-1 bg-third text-primary flex items-center justify-center"
                >
                  {counter}
                </div>

                <FiHeart size={20} />
              </Link>
              <button
                onClick={openCart}
                className="p-2 text-third relative  transition-colors cursor-pointer"
              >
                <div className="absolute w-[13px]  h-[13px]  text-[12px] rounded-full start-6 top-1 bg-third text-primary flex items-center justify-center">
                  {cartCounter}
                </div>
                <FiShoppingBag size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopNav;
