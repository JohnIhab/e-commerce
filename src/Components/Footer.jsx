import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
// import logo from "../assets/Home/Logo_Header.jpg";
import footerBackground from "../assets/Home/footer.png";
import Subscribe from "./Subscribe";
import { SettingsContext } from "../context/Settings";
import { FaLinkedinIn } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language
  const {
    footerLogo,
    facebookLink,
    instagramLink,
    twitterLink,
    youtubeLink,
    tiktokLink,
    linkedinLink,
    address,
    footerText_en,
    footerText_ar,
    sitePhone,
  } = useContext(SettingsContext);
  return (
    <footer
      className="  relative top-full"
      style={{
        backgroundImage: `url(${footerBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8  ">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-block hover:font-bold transition-all duration-200"
            >
              {footerLogo ? (
                <img src={footerLogo} alt="Joot Bag" className="w-40" />
              ) : null}
            </Link>
            <p className="text-white text-sm mt-4">
              {lang === "en"? footerText_en:footerText_ar??footerText_en}
            </p>
            <div className="flex items-center gap-3 mt-4 text-white text-sm">
              <FiMapPin /> <span>{address}</span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-white text-sm">
              <FiPhone />
              <a
                href="tel:+92000000000"
                className="hover:text-white hover:font-bold transition-all duration-200"
              >
                {sitePhone}
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-3 text-white">
              {t("footer.shop")}
            </h4>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link
                  to="/products"
                  className="hover:text-white hover:font-bold transition-all duration-200"
                >
                  {t("footer.shopLinks.allBags")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products/new"
                  className="hover:text-white hover:font-bold transition-all duration-200"
                >
                  {t("footer.shopLinks.newArrivals")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products/bestsellers"
                  className="hover:text-white hover:font-bold transition-all duration-200"
                >
                  {t("footer.shopLinks.bestSellers")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products/sale"
                  className="hover:text-white hover:font-bold transition-all duration-200"
                >
                  {t("footer.shopLinks.sale")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3 text-white">
              {t("footer.support")}
            </h4>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link
                  to="/about"
                  className="hover:text-white hover:font-bold transition-all duration-200"
                >
                  {t("footer.supportLinks.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white hover:font-bold transition-all duration-200"
                >
                  {t("footer.supportLinks.contact")}
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-white hover:font-bold transition-all duration-200"
                >
                  {t("footer.supportLinks.shippingReturns")}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-white hover:font-bold transition-all duration-200"
                >
                  {t("footer.supportLinks.faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow us */}
          <div>
            <h4 className="font-semibold mb-3 text-white  ">
              {t("footer.followUs")}
            </h4>
            <p className="text-sm text-white">{t("footer.followUsText")}</p>
            <div className="flex gap-3 mt-3 text-white">
              {facebookLink ? (
                <a
                  aria-label={t("footer.socialAlt.facebook")}
                  href={facebookLink}
                  className="p-2 border rounded-md hover:bg-white hover:text-black hover:font-bold transition-all duration-200"
                >
                  <FiFacebook />
                </a>
              ) : null}

              {instagramLink ? (
                <a
                  aria-label={t("footer.socialAlt.instagram")}
                  href={instagramLink}
                  className="p-2 border rounded-md hover:bg-white hover:text-black hover:font-bold transition-all duration-200"
                >
                  <FiInstagram />
                </a>
              ) : null}

              {twitterLink ? (
                <a
                  aria-label={t("footer.socialAlt.twitter")}
                  href={twitterLink}
                  className="p-2 border rounded-md hover:bg-white hover:text-black hover:font-bold transition-all duration-200"
                >
                  <FaXTwitter />
                </a>
              ) : null}
              {youtubeLink ? (
                <a
                  aria-label={t("footer.socialAlt.youtube")}
                  href={youtubeLink}
                  className="p-2 border rounded-md hover:bg-white hover:text-black hover:font-bold transition-all duration-200"
                >
                  <FiYoutube />
                </a>
              ) : null}
              {linkedinLink ? (
                <a
                  aria-label={t("footer.socialAlt.linkedin")}
                  href={linkedinLink}
                  className="p-2 border rounded-md hover:bg-white hover:text-black hover:font-bold transition-all duration-200"
                >
                  <FaLinkedinIn />
                </a>
              ) : null}

              {tiktokLink ? (
                <a
                  aria-label={t("footer.socialAlt.tiktok")}
                  href={tiktokLink}
                  className="p-2 border rounded-md hover:bg-white hover:text-black hover:font-bold transition-all duration-200"
                >
                  <FaTiktok />
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-2 mb-3">
          <Subscribe />
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white">
          {/* {new Date().getFullYear()} */}
          <p> {""}</p>
          <div className="flex gap-4">
            <Link
              to="/privacy"
              className="hover:text-white hover:font-bold transition-all duration-200"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to="/terms"
              className="hover:text-white hover:font-bold transition-all duration-200"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
