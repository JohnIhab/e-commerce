import React, { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const DynamicAbout = () => {
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(null);

  useEffect(() => {
    let isActive = true;
    async function fetchPage() {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${baseUrl}/custom-pages/about-us`, {
          headers: { "x-api-key": XApiKey },
        });
        if (!isActive) return;
        setPage(data?.data || null);
      } catch (_e) {
        if (!isActive) return;
        setError("Failed to load about us");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    fetchPage();
    return () => {
      isActive = false;
    };
  }, [baseUrl, XApiKey]);

  const view = useMemo(() => {
    if (!page) return null;
    const title =
      lang === "ar"
        ? page.title_ar || page.title_en
        : page.title_en || page.title_ar;
    const content =
      lang === "ar"
        ? page.content_ar || page.content_en
        : page.content_en || page.content_ar;
    const metaTitle =
      lang === "ar" ? page.meta_title_ar || title : page.meta_title_en || title;
    const metaDesc =
      lang === "ar"
        ? page.meta_description_ar || ""
        : page.meta_description_en || "";
    const metaImg = page.meta_img || undefined;
    return { title, content, metaTitle, metaDesc, metaImg };
  }, [page, lang]);

  return (
    <>
      <Helmet>
        <title>
          {view?.metaTitle || (lang === "ar" ? "عن الشركة" : "About Us")}
        </title>
        {view?.metaDesc ? (
          <meta name="description" content={view.metaDesc} />
        ) : null}
        {view?.metaImg ? (
          <meta property="og:image" content={view.metaImg} />
        ) : null}
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 md:p-10">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-64 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-6 text-center">
              {error}
            </div>
          ) : view ? (
            <>
              <article className="prose max-w-none prose-neutral md:prose-lg prose-headings:text-[#0e1733] prose-p:text-gray-600 prose-ul:marker:text-gray-400 prose-a:text-primary hover:prose-a:underline">
                <div
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  dangerouslySetInnerHTML={{ __html: view.content }}
                />
              </article>
              <div className="mt-8 pt-6 border-t flex items-center justify-between text-sm text-gray-500">
                <span>
                  {lang === "ar"
                    ? "هل لديك أسئلة حول هذه الشركة؟"
                    : "Have questions about this company?"}
                </span>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-[#0e1733] font-semibold"
                >
                  {lang === "ar" ? "تواصل معنا" : "Contact us"}
                </a>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default DynamicAbout;
