// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
// import translationEN from "./Locales/en/translation.json";
// import translationAR from "./Locales/ar/translation.json";

// const resources = {
//   en: {
//     translation: translationEN,
//   },
//   ar: {
//     translation: translationAR,
//   },
// };

// const detectorOptions = {
//   order: ["localStorage", "navigator", "htmlTag", "cookie", "querystring"],
//   caches: ["localStorage"],
// };

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources,
//     lng: "en",
//     fallbackLng: "en",
//     detection: detectorOptions,
//     interpolation: { escapeValue: false },
//     initImmediate: false,
//   })
//   .then(() => {
//     const lng =
//       i18n.language ||
//       (typeof window !== "undefined" &&
//         window.localStorage &&
//         window.localStorage.getItem("lang")) ||
//       "en";
//     if (typeof document !== "undefined") {
//       document.documentElement.setAttribute("lang", lng);
//       document.documentElement.dir = lng.startsWith("ar") ? "rtl" : "ltr";
//     }
//   });

// // Update document dir when language changes
// i18n.on("languageChanged", (lng) => {
//   try {
//     if (typeof window !== "undefined" && window.localStorage) {
//       window.localStorage.setItem("lang", lng);
//     }
//   } catch {}
//   if (typeof document !== "undefined") {
//     document.documentElement.setAttribute("lang", lng);
//     document.documentElement.dir = lng && lng.startsWith("ar") ? "rtl" : "ltr";
//   }
// });

// export default i18n;
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./Locales/en/translation.json";
import translationAR from "./Locales/ar/translation.json";

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
};

const detectorOptions = {
  order: ["localStorage"],
  caches: ["localStorage"],
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    lng: "en",
    fallbackLng: "en",

    detection: detectorOptions,
    interpolation: {
      escapeValue: false,
    },
  });

const updateDocumentLang = (lng) => {
  if (typeof document === "undefined") return;

  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
};

// أول مرة
updateDocumentLang(i18n.language);

// عند تغيير اللغة
i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem("lang", lng);
  } catch {}

  updateDocumentLang(lng);
});

export default i18n;
