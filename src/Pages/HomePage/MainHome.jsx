import React, { useContext, useEffect } from "react";
import HeroSection from "./HeroSection";
import Slider from "./Slider";
import Categories from "./Categories";
import ProductsHome from "./ProductsHome";
import { Services } from "./Services";
import BestSeller from "./BestSeller";
import { Helmet } from "react-helmet";
import FlashSection from "./FlashSection";
import BrandsSection from "./BrandsSection";
import HotOffersSection from "./HotOffersSection";
import NewArrival from "./NewArrival";
import LastPieces from "./LastPieces";
import FeaturesOffer from "./FeaturesOffer";
import FeaturesBundleOffers from "./FeatureBundleOffers";
import Newest from "./Newest";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../../context/Settings";
import { addToCartContext } from "../../context/AddToCartContext";

const MainHome = () => {
  const { siteName_ar, siteName_en } = useContext(SettingsContext);
  const { showModal, setShowModal } = useContext(addToCartContext);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(()=>{
    if(showModal){
      document.body.classList.add("overflow-y-hidden")
    }
    else{
      document.body.classList.remove("overflow-y-hidden")
    }
  },[showModal])
  return (
    <>
      <Helmet key={lang}>
        <title>
          {lang === "en"
            ? `${siteName_en} | Home`
            : `${siteName_ar}  | الرئيسية`}
        </title>
        <meta
          name="description"
          content={
            lang === "en"
              ? `${siteName_en} | Home`
              : `${siteName_ar}  | الرئيسية`
          }
        />
      </Helmet>
      <HeroSection />
      <Slider />

      {/* Sections */}

      <Categories />
      <FeaturesBundleOffers />
      <FeaturesOffer />
      <HotOffersSection />
      {/* <Services /> */}
      <NewArrival />
      <Newest />
      <BestSeller />
      <ProductsHome />
      <LastPieces />

      <FlashSection />
      {/* <BrandsSection /> */}
    </>
  );
};

export default MainHome;
