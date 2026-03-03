import React, { useContext, useEffect, useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { BsMailbox } from "react-icons/bs";
import { MdContactPage } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { CgProfile } from "react-icons/cg";
import { PiShippingContainer } from "react-icons/pi";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LuPackage, LuMenu } from "react-icons/lu";
import { LuPackageCheck } from "react-icons/lu";
import { LuPackageX } from "react-icons/lu";
import { TbTruckReturn } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { Helmet } from "react-helmet";
import { AddressesContext } from "../../context/GetAddresses";
import { useTranslation } from "react-i18next";
import { LuPanelLeftOpen } from "react-icons/lu";

const UserProfile = () => {
  const [open, setOpen] = useState(null);
  const [walletInfo, setWalletInfo] = useState({ symbol: null, balance: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { addresses } = useContext(AddressesContext);
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [userData, setUserData] = useState({});
  const [changed, setChanged] = useState()
  const { t } = useTranslation();

  async function getUserData() {
    const response = await axios.get(`${baseUrl}/auth/profile`, {
      headers: {
        "X-API-KEY": XApiKey,
        Authorization: `${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["getUserData", changed],
    queryFn: getUserData,
  });

  useEffect(() => {
     setUserData(data);
  }, [data]);

  const toggle = (section) => {
    setOpen((prev) => (prev === section ? null : section));
  };

  useEffect(() => {
    if (
      location.pathname === "/userprofile" ||
      location.pathname === "/userprofile/profile"
    ) {
      setOpen("profile");
    } else if (location.pathname === "/userprofile/addresses") {
      setOpen("addresses");
    } else if (location.pathname === "/userprofile/orders") {
      setOpen("orders");
    } else if (location.pathname === "/userprofile/points") {
      setOpen("points");
    } else if (location.pathname === "/userprofile/wallet") {
      setOpen("wallet");
    } else {
      setOpen(null);
    }
  }, [location.pathname]);

  // Fetch orders across all pages and compute simple counts for sidebar
  const {
    data: ordersSummary = { total: 0, successful: 0, canceled: 0, returned: 0 },
    isLoading: ordersLoading,
  } = useQuery({
    queryKey: ["orders-summary"],
    queryFn: async () => {
      try {
        const headers = {
          "X-API-KEY": XApiKey,
          Authorization: "Bearer " + localStorage.getItem("token"),
        };

        const first = await axios.get(`${baseUrl}/orders?page=1`, { headers });
        const firstData = first.data?.data || {};
        const last_page = firstData.last_page ?? 1;
        let orders = Array.isArray(firstData.data) ? [...firstData.data] : [];

        if (last_page > 1) {
          const promises = [];
          for (let p = 2; p <= last_page; p++) {
            promises.push(
              axios.get(`${baseUrl}/orders?page=${p}`, { headers })
            );
          }
          const responses = await Promise.all(promises);
          responses.forEach((r) => {
            const d = r.data?.data;
            if (d && Array.isArray(d.data)) orders = orders.concat(d.data);
          });
        }

        const total = orders.length;
        let canceled = 0;
        let returned = 0;
        orders.forEach((o) => {
          const s = String(o.order_status || "").toLowerCase();
          if (s === "canceled" || s === "cancelled") canceled++;
          else if (s === "returned") returned++;
        });
        const successful = total - canceled - returned;
        return { total, canceled, returned, successful };
      } catch (err) {
        // on error, return zeros
        console.error("orders-summary error:", err);
        return { total: 0, canceled: 0, returned: 0, successful: 0 };
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <Helmet>
        <title>{"JootBag | User Profile"}</title>
        <meta name="description" content="JootBagUserProfile" />
      </Helmet>

      <div className="py-30 gap-7 flex px-3 relative">
        {/* Sidebar Toggle Icon for Mobile */}
        <button
          className="lg:hidden fixed top-[120px] left-4 z-30 bg-third text-primary p-2 rounded-full shadow-md"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          {/* Hamburger icon */}
          <LuPanelLeftOpen  size={28}/>
        </button>

        {/* Sidebar */}
        {/* Desktop sidebar */}
        <div className="lg:w-3/12 hidden lg:block">
          <SidebarContent
            open={open}
            toggle={toggle}
            userData={userData}
            addresses={addresses}
            ordersLoading={ordersLoading}
            ordersSummary={ordersSummary}
            walletInfo={walletInfo}
            t={t}
          />
        </div>
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 backdrop-blur-md bg-black/20 lg:hidden"
            style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        {/* Mobile sidebar drawer */}
        <div
          className={`fixed top-0 left-0 pt-20 h-full w-72 bg-[#1a2323] z-30 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <button
            className="absolute top-4 right-4 text-primary bg-third p-2 rounded-full mt-15"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            {/* X icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div className="pt-16 px-2">
            <SidebarContent
              open={open}
              toggle={toggle}
              userData={userData}
              addresses={addresses}
              ordersLoading={ordersLoading}
              ordersSummary={ordersSummary}
              walletInfo={walletInfo}
              t={t}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-9/12 w-full">
          <Outlet context={{ setWalletInfo, walletInfo, userData, setChanged }} />
        </div>
      </div>
    </>
  );
// SidebarContent extracted for reuse (desktop/mobile)
function SidebarContent({ open, toggle, userData, addresses, ordersLoading, ordersSummary, walletInfo, t }) {
  return (
    <div className="max-w-2xl mx-auto space-y-2">
      {/* Welcome */}
      <div className="p-1 bg-third text-primary rounded-lg">
        <h3 className="text-center font-bold text-2xl mb-2">
          {t("profile.Welcome")}, {userData?.name}
        </h3>
      </div>
      {/* Profile */}
      <div className="my-2">
        <Link
          to=""
          onClick={() => toggle("profile")}
          className={`w-full flex justify-between items-center bg-third text-primary px-4 py-2 font-bold text-xl ${open === "profile" ? "rounded-t-lg" : "rounded-lg"}`}
        >
          <div className="flex gap-2 items-center">
            <CgProfile size={30} />
            <h3 className="font-bold text-xl">{userData?.name}</h3>
          </div>
          <span className="text-2xl">{open === "profile" ? "−" : "+"}</span>
        </Link>
        <AnimatePresence>
          {open === "profile" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden bg-third text-primary rounded-b-lg p-4"
            >
              <div className="flex items-center gap-2">
                <MdContactPage size={22} />
                <h3 className="font-bold text-xl my-2">{t("profile.Contact Info")}</h3>
              </div>
              <div className="flex my-2 items-center gap-2">
                <BsMailbox size={20} />
                <span className="font-bold w-3/12">{t("profile.Email")}:</span>
                <p>{userData?.email}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Saved Addresses */}
      <div className="my-2">
        <Link
          to="addresses"
          onClick={() => toggle("addresses")}
          className={`w-full flex justify-between items-center bg-third text-primary px-4 py-2 font-bold text-xl ${open === "addresses" ? "rounded-t-lg" : "rounded-lg"}`}
        >
          <div className="flex gap-2 items-center">
            <FaLocationArrow size={25} />
            <h3 className="font-bold text-xl">{t("profile.Saved Addresses")}</h3>
          </div>
          <span className="text-2xl">{open === "addresses" ? "−" : "+"}</span>
        </Link>
        <AnimatePresence>
          {open === "addresses" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden bg-third text-primary rounded-b-lg p-4"
            >
              {addresses.map((address) =>
                address.set_default === 1 ? (
                  <div className="flex justify-between items-center bg-primary/10 p-2 rounded-xl px-2 mb-2" key={address.id}>
                    <div className="flex my-2 items-center gap-3">
                      <HiOutlineLocationMarker size={30} />
                      <div>
                        <p>{address.address.slice(0, 25)}...</p>
                      </div>
                    </div>
                    <div className="bg-primary/20 p-3 rounded-full flex items-center justify-center cursor-pointer">
                      <FaRegEdit size={25} className="text-primary" style={{ padding: 1 }} />
                    </div>
                  </div>
                ) : null
              )}
              {addresses.map((address) =>
                address.set_default !== 1 ? (
                  <div className="flex justify-between items-center rounded-xl px-2 mb-2" key={address.id}>
                    <div className="flex my-2 items-center gap-3">
                      <HiOutlineLocationMarker size={30} />
                      <div>
                        <span className="font-bold w-3/12">{t("profile.home")}:</span>
                        <p>{address.address.slice(0, 25)}...</p>
                      </div>
                    </div>
                    <div className="bg-primary p-3 rounded-full flex items-center justify-center cursor-pointer">
                      <FaRegEdit size={25} className="text-third" style={{ padding: 1 }} />
                    </div>
                  </div>
                ) : null
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Orders */}
      <div className="my-2">
        <Link
          to="orders"
          onClick={() => toggle("orders")}
          className={`w-full flex justify-between items-center bg-third text-primary px-4 py-2 font-bold text-xl ${open === "orders" ? "rounded-t-lg" : "rounded-lg"}`}
        >
          <div className="flex gap-2 items-center">
            <PiShippingContainer />
            <h3 className="font-bold text-xl">{t("profile.Orders")}</h3>
          </div>
          <span className="text-2xl">{open === "orders" ? "−" : "+"}</span>
        </Link>
        <AnimatePresence>
          {open === "orders" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden bg-third text-primary rounded-b-lg p-4"
            >
              <div className="flex my-2 items-center gap-7">
                <LuPackage size={20} />
                <span className="font-bold w-3/12">{t("profile.All Orders")}:</span>
                <p>{ordersLoading ? "..." : ordersSummary.total}</p>
              </div>
              <div className="flex my-2 items-center gap-7">
                <LuPackageCheck size={20} />
                <span className="font-bold w-3/12">{t("profile.Sucssessful")}:</span>
                <p>{ordersLoading ? "..." : ordersSummary.successful}</p>
              </div>
              <div className="flex my-2 items-center gap-7">
                <LuPackageX size={20} />
                <span className="font-bold w-3/12">{t("profile.Canceled")}:</span>
                <p>{ordersLoading ? "..." : ordersSummary.canceled}</p>
              </div>
              <div className="flex my-2 items-center gap-7">
                <TbTruckReturn size={20} />
                <span className="font-bold w-3/12">{t("profile.Returned")}:</span>
                <p>{ordersLoading ? "..." : ordersSummary.returned}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Wallet */}
      <div className="my-2">
        <Link
          to="wallet"
          onClick={() => toggle("wallet")}
          className={`w-full flex justify-between items-center bg-third text-primary px-4 py-2 font-bold text-xl ${open === "wallet" ? "rounded-t-lg" : "rounded-lg"}`}
        >
          <div className="flex gap-2 items-center">
            <MdAccountBalanceWallet size={25} />
            <h3 className="font-bold text-xl">{t("profile.Wallet")}</h3>
          </div>
          <span className="text-2xl">{open === "wallet" ? "−" : "+"}</span>
        </Link>
        <AnimatePresence>
          {open === "wallet" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden bg-third text-primary rounded-b-lg p-4"
            >
              <div className="flex my-2 items-center gap-2">
                <MdAccountBalanceWallet size={20} />
                <span className="font-bold w-3/12">{t("profile.Balance")}:</span>
                <p>
                  {walletInfo && walletInfo.symbol && walletInfo.balance && (
                    <span className="text-center text-sm mt-1">
                      {walletInfo.symbol} {walletInfo.balance}
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Points */}
      <div className="my-2">
        <Link
          to="points"
          onClick={() => toggle("points")}
          className={`w-full flex justify-between items-center bg-third text-primary px-4 py-2 font-bold text-xl ${open === "points" ? "rounded-t-lg" : "rounded-lg"}`}
        >
          <div className="flex gap-2 items-center">
            <FaRegStar size={22} />
            <h3 className="font-bold text-xl">{t("profile.Points")}</h3>
          </div>
          <span className="text-2xl">{open === "points" ? "−" : "+"}</span>
        </Link>
        <AnimatePresence>
          {open === "points" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden bg-third text-primary rounded-b-lg p-4"
            >
              <p className="text-sm text-gray-200">{t("profile.View your points summary")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
};

export default UserProfile;
