import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ApiAuthContext } from "./AuthContext";
export const SettingsContext = createContext(0);

export default function SettingsContextProvider({ children }) {
  const [siteName_ar, setSiteName_ar] = useState("");
  const [siteName_en, setSiteName_en] = useState("");
  const [siteEmail, setSiteEmail] = useState("");
  const [sitePhone, setSitePhone] = useState("");
  const [mainLogo, setMainLogo] = useState("");
  const [footerLogo, setFooterLogo] = useState("");
  const [favicon, setFavicon] = useState("");
  const [mainColor, setMainColor] = useState("");
  const [darkMainColor, setDarkMainColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [thirdColor, setThirdColor] = useState("");

  const [darkSecondaryColor, setDarkSecondaryColor] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [tiktokLink, setTiktokLink] = useState("");
  const [address, setAddress] = useState("");
  const [footerText_en, setFooterText_en] = useState("");
  const [footerText_ar, setFooterText_ar] = useState("");
  const [enableDarkMode, setEnableDarkMode] = useState("");

  const [isCustomBanner, setIsCustomBanner] = useState("");
  const [CustomBannerEn, setCustomBannerEn] = useState("");
  const [CustomBannerAr, setCustomBannerAr] = useState("");
  const [CustomTextEn, setCustomTextEn] = useState("");
  const [CustomTextAr, setCustomTextAr] = useState("");

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

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
  const setColors = (isDark, data) => {
    const vars = {
      main: isDark ? data.dark_main_color : data.main_color,
      secondary: isDark ? data.dark_secondary_color : data.secondary_color,
      third: isDark ? data.dark_third_color : data.third_color,
    };

    Object.entries(vars).forEach(([key, value]) => {
      if (value) {
        document.documentElement.style.setProperty(`--${key}`, value);
      }
    });
  };
  useEffect(() => {
    if (data) {
      setSiteName_ar(data.site_name);
      setSiteName_en(data.site_name_en);
      setSiteEmail(data.site_email);
      setSitePhone(data.site_phone);
      setMainLogo(data.main_logo);
      setFooterLogo(data.footer_logo);
      setFavicon(data.favicon);
      setMainColor(data.main_color);
      setDarkMainColor(data.dark_main_color);
      setSecondaryColor(data.secondary_color);
      setDarkSecondaryColor(data.dark_secondary_color);
      setThirdColor(data.third_color)
      setFacebookLink(data.facebook_link);
      setInstagramLink(data.instagram_link);
      setLinkedinLink(data.linkedin_link);
      setTwitterLink(data.twitter_link);
      setYoutubeLink(data.youtube_link);
      setTiktokLink(data.tiktok_link);
      setAddress(data.address);
      setFooterText_en(data.footer_text_en);
      setFooterText_ar(data.footer_text_ar);
      setEnableDarkMode(data.enable_dark_mode);
      setIsCustomBanner(data.is_custom);
      setCustomBannerEn(data.custom_banner_en);
      setCustomBannerAr(data.custom_banner_ar);
      setCustomTextEn(data.custom_text_en);
      setCustomTextAr(data.custom_text_ar);
    }
    if (data) {
      const isDark = document.documentElement.classList.contains("dark");
      setColors(isDark, data);
    }
  }, [data, isDark]);

  return (
    <SettingsContext.Provider
      value={{
        siteName_ar,
        siteName_en,
        siteEmail,
        sitePhone,
        mainLogo,
        footerLogo,
        favicon,
        mainColor,
        secondaryColor,
        thirdColor,
        darkMainColor,
        darkSecondaryColor,
        facebookLink,
        instagramLink,
        linkedinLink,
        twitterLink,
        youtubeLink,
        tiktokLink,
        address,
        footerText_en,
        footerText_ar,
        isDark,
        setIsDark,
        enableDarkMode,
        isCustomBanner,
        CustomBannerEn,
        CustomBannerAr,
        CustomTextEn,
        CustomTextAr,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
