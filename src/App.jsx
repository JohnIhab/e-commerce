import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import Layout from "./Components/Layout";
import MainHome from "./Pages/HomePage/MainHome";
import MainWish from "./Pages/WishlistPage/MainWish";
import MainAbout from "./Pages/AboutPage/MainAbout";
import MainContact from "./Pages/ContactPage/MainContact";
import ApiAuthContextProvider, { ApiAuthContext } from "./context/AuthContext";
import MainPrivacy from "./Pages/PrivacyPolicy/MainPrivacy";
import MainTerms from "./Pages/TermsServices/MainTerms";
import Shop from "./Pages/ShopPage/Shop";
import MainDetails from "./Pages/DetailsPage/MainDetails";
import MainBlogs from "./Pages/BlogPage/MainBlogs";
import LoginPage from "./Pages/LoginPage/LoginPage";
import MainCompare from "./Pages/ComparePage/MainCompare";
import SignUp from "./Pages/SignUpPage/SignUp";
import UserContextProvider, { userContext } from "./context/userContext";
import UserProfile from "./Pages/userProfile/userProfile";
import Profile from "./Pages/UserProfile/Profile";
import Addresses from "./Pages/UserProfile/Addresses";
import Orders from "./Pages/UserProfile/Orders";
import ConfirmCode from "./ConfirmCodePage/ConfirmCode";
import ForgetPassword from "./ForgetPasswordPage/ForgetPassword";
import PasswordConfirm from "./ForgetPasswordPage/passwordConfirm";
import Cart from "./Pages/CartPage/Cart";
import Checkout from "./Pages/CheckoutPage/Checkout";
import Invoice from "./Pages/InvoicePage/Invoice";
import BlogDetails from "./Pages/BlogPage/BlogDetails";
import FlashDealsPage from "./Pages/FlashDealsPage/FlashDealsPage";
import FlashDetails from "./Pages/FlashDetails/FlashDetails";
import OfferDetails from "./Pages/OffersPage/OfferDetails";
import ProtectedRoute from "./Components/ProtectedRoute";
import SettingsContextProvider, { SettingsContext } from "./context/Settings";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AddToWishListContextProvider from "./context/AddToWishListContext";
import Categories from "./Pages/CategoriesPage/Categories";
import CategoriesContextProvider from "./context/CategoriesContext";
import CategoryDetails from "./Pages/CategoryDetails/CategoryDetails";
import NewArrivalPage from "./Pages/NewArrival/NewArrivalPage";
import HotOffersPage from "./Pages/HotOffersPage/HotOffersPage";
import BestSellerPage from "./Pages/BestSellerPage/BestSellerPage";
import LastPiecesPage from "./Pages/LastPiecesPage/LastPiecesPage";
import CurrencyProvider from "./context/Currency";
import WishlistProvider from "./context/GetWishList";
import AddToCartContextProvider from "./context/AddToCartContext";
import DeleteCartContextProvider, {
  deleteCartContext,
} from "./context/DeleteCartContext";
import OffersPage from "./Pages/OffersPage/OffersPage";
import AddBundleToCartContextProvider from "./context/AddBundleToCartContext";
import Wallet from "./Pages/UserProfile/Wallet";
import BundleOfferDetails from "./Pages/BundleOfferDetails/BundleOfferDetails";
import BundleOffersPage from "./Pages/BundleOffersPage/BundleOffersPage";
import AddressesProvider from "./context/GetAddresses";

import Points from "./Pages/UserProfile/Points";
import NotFound from "./Pages/Not-Found/NotFound";
import CartProvider from "./context/GetCartContext";
import { CompareProvider } from "./context/CompareContext";
import PaymentStatus from "./Pages/PaymentStatus/PaymentStatus";
import AddressContextProvider from "./context/AddressContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainHome /> },
      {
        path: "/wishlist",
        element: (
          <ProtectedRoute>
            <MainWish />
          </ProtectedRoute>
        ),
      },
      { path: "/compare", element: <MainCompare /> },
      { path: "/about", element: <MainAbout /> },
      { path: "/contact", element: <MainContact /> },
      { path: "/privacy", element: <MainPrivacy /> },
      { path: "/terms", element: <MainTerms /> },
      { path: "/shop", element: <Shop /> },
      { path: "/blog", element: <MainBlogs /> },
      { path: "/categories", element: <Categories /> },
      { path: "/categories/:slug", element: <CategoryDetails /> },
      { path: "/new-arrival", element: <NewArrivalPage /> },
      { path: "/new-arrival/:page", element: <NewArrivalPage /> },
      { path: "/hot-offers", element: <HotOffersPage /> },
      { path: "/hot-offers/:page", element: <HotOffersPage /> },
      { path: "/offers", element: <OffersPage /> },
      { path: "/offers/page/:page", element: <OffersPage /> },
      { path: "/offers/:slug", element: <OfferDetails /> },
      { path: "/best-seller", element: <BestSellerPage /> },
      { path: "/best-seller/:page", element: <BestSellerPage /> },
      { path: "/last-pieces", element: <LastPiecesPage /> },
      { path: "/last-pieces/:page", element: <LastPiecesPage /> },
      { path: "/bundle-offers", element: <BundleOffersPage /> },
      { path: "/bundle-offers/:slug", element: <BundleOfferDetails /> },
      // { path: "/brands", element: <Categories /> },
      { path: "/blog/:slug", element: <BlogDetails /> },
      { path: "/details/:slug", element: <MainDetails /> },
      {
        path: "/login",
        element: (
          <ProtectedRoute>
            <LoginPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <ProtectedRoute>
            <SignUp />
          </ProtectedRoute>
        ),
      },
      { path: "/confirm-code", element: <ConfirmCode /> },
      { path: "/forgot-password", element: <ForgetPassword /> },
      { path: "/password-confirm", element: <PasswordConfirm /> },
      { path: "/payment-status", element: <PaymentStatus /> },

      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/invoice", element: <Invoice /> },
      // { path: "/flashdeals", element: <FlashDealsPage /> },
      { path: "/flashdeals/:slug", element: <FlashDetails /> },
      {
        path: "/userprofile",
        element: <UserProfile />,
        children: [
          { index: true, element: <Profile /> },
          { path: "wallet", element: <Wallet /> },
          { path: "addresses", element: <Addresses /> },
          { path: "orders", element: <Orders /> },
          { path: "wallet", element: <Wallet /> },
          { path: "points", element: <Points /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

function App() {
  const [favicon, setFavicon] = useState("");
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  async function getSiteSettings() {
    const res = await axios.get(`${baseUrl}/settings`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return res.data.data;
  }

  let { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["getSiteSettings"],
    queryFn: getSiteSettings,
  });
  useEffect(() => {
    if (data) {
      setFavicon(data.favicon);
    }
  }, [data]);

  // function useInjectScripts(scriptsObj) {
  //   useEffect(() => {
  //     if (!scriptsObj) return;

  //     Object.entries(scriptsObj).forEach(([key, code]) => {
  //       if (!code || typeof code !== "string") return;

  //       const scriptId = `dynamic-pixel-${key}`;
  //       if (document.getElementById(scriptId)) return;

  //       // special container
  //       const wrapper = document.createElement("div");
  //       wrapper.id = scriptId;

  //       // inject raw HTML directly
  //       wrapper.innerHTML = code;

  //       document.head.appendChild(wrapper);
  //     });
  //   }, [scriptsObj]);
  // }

  // const [pagePixels, setPagePixels] = useState([]);
  // async function getPixels() {
  //   let response = await axios.get(`${baseUrl}/pixels`, {
  //     headers: {
  //       "X-API-KEY": XApiKey,
  //     },
  //   });
  //   return response.data.data;
  // }

  // let { data: pixelsData } = useQuery({
  //   queryKey: ["pixels"],
  //   queryFn: getPixels,
  // });

  // useEffect(() => {
  //   if (pixelsData) {
  //     setPagePixels(pixelsData);
  //   }
  // }, [pixelsData]);

  // useInjectScripts(pixelsData);

  return (
    <>
      <Helmet>
        {favicon && <link rel="icon" type="image/webp" href={favicon} />}
      </Helmet>
      <CurrencyProvider>
        <WishlistProvider>
          <AddressesProvider>
            <AddressContextProvider>
              <CartProvider>
                <SettingsContextProvider>
                  <AddToWishListContextProvider>
                    <AddToCartContextProvider>
                      <CompareProvider>
                        <AddBundleToCartContextProvider>
                          <DeleteCartContextProvider>
                            <CategoriesContextProvider>
                              <UserContextProvider>
                                <RouterProvider router={router} />
                              </UserContextProvider>
                            </CategoriesContextProvider>
                          </DeleteCartContextProvider>
                        </AddBundleToCartContextProvider>
                      </CompareProvider>
                    </AddToCartContextProvider>
                  </AddToWishListContextProvider>
                </SettingsContextProvider>
              </CartProvider>
            </AddressContextProvider>
          </AddressesProvider>
        </WishlistProvider>
      </CurrencyProvider>
    </>
  );
}

export default App;
