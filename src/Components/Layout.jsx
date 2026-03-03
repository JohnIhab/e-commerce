import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, ScrollRestoration } from "react-router-dom";
import CartSideBar from "./CartSideBar";
import { CartUIProvider } from "../context/CartUIProvider";
import Footer from "./Footer";
import Search from "./Search";
import AddToCartModal from "./AddToCartModal";
import { addToCartContext } from "../context/AddToCartContext";
import PixelScripts from './PixelScript';

const Layout = () => {
  const { showModal, setShowModal } = useContext(addToCartContext);
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [showModal]);
  return (
    <>
    <PixelScripts/>
      <CartUIProvider>
        <Navbar />
        <ScrollRestoration />
        <Outlet />
        {showModal ? <AddToCartModal /> : null}
        <CartSideBar />
        <Search />
        <Footer />
      </CartUIProvider>
    </>
  );
};

export default Layout;
