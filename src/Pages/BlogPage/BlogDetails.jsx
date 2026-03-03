import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { IoArrowBack } from "react-icons/io5";
import he from "he";
function DecodedText({ text }) {
  const safeText = typeof text === "string" ? text : "";
  const decodedHtml = he.decode(safeText);

  return <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />;
}
const BlogDetails = () => {
  const { slug } = useParams();
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    let isActive = true;
    async function fetchDetails() {
      if (!slug) {
        setError("Invalid slug");
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        // Query list and match by slug (supports both slug_en and slug_ar)
        const { data } = await axios.get(`${baseUrl}/blogs`, {
          headers: { "x-api-key": XApiKey },
          params: { slug },
        });
        if (!isActive) return;
        const list =
          data?.data?.blogs?.data || data?.data?.blogs || data?.blogs || [];
        const found = Array.isArray(list)
          ? list.find((b) => b?.slug_en === slug || b?.slug_ar === slug)
          : null;
        setBlog(found || data?.data || null);
      } catch (err) {
        if (!isActive) return;
        setError("Failed to load blog details");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    fetchDetails();
    return () => {
      isActive = false;
    };
  }, [baseUrl, XApiKey, slug]);

  const view = useMemo(() => {
    if (!blog) return null;
    const title =
      lang === "ar"
        ? blog.title_ar || blog.title_en || ""
        : blog.title_en || blog.title_ar || "";
    const description =
      lang === "ar"
        ? blog.description_ar || blog.short_description_ar || ""
        : blog.description_en || blog.short_description_en || "";
    const banner =
      blog[lang === "ar" ? "banner_ar" : "banner_en"] || blog.meta_img;
    const category =
      blog?.blog_category?.[lang === "ar" ? "title_ar" : "title_en"];
    const metaTitle =
      blog[lang === "ar" ? "title_ar" : "title_en"] || title || "Blog";
    const metaDesc =
      blog[lang === "ar" ? "meta_description_ar" : "meta_description_en"] ||
      description?.slice(0, 160);
    const metaKeywords =
      blog[lang === "ar" ? "meta_keywords_ar" : "meta_keywords_en"] ||
      undefined;
    const metaImage = blog.meta_img || banner;
    return {
      title,
      description,
      banner,
      category,
      metaTitle,
      metaDesc,
      metaKeywords,
      metaImage,
    };
  }, [blog, lang]);

  return (
    <>
      <Helmet>
        <title>{view?.metaTitle || "Blog"}</title>
        {view?.metaDesc ? (
          <meta name="description" content={view.metaDesc} />
        ) : null}
        {view?.metaKeywords ? (
          <meta name="keywords" content={view.metaKeywords} />
        ) : null}
        {view?.metaImage ? (
          <meta property="og:image" content={view.metaImage} />
        ) : null}
        <meta property="og:title" content={view?.metaTitle || "Blog"} />
        {view?.metaDesc ? (
          <meta property="og:description" content={view.metaDesc} />
        ) : null}
      </Helmet>

      <div className="max-w-5xl mx-auto px-5 md:px-6 py-10">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="w-full h-64 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-6 text-center">
            {error}
          </div>
        ) : !view ? (
          <div className="bg-gray-50 text-gray-600 border border-gray-200 rounded-xl p-6 text-center">
            {lang === "ar" ? "المقال غير موجود" : "Blog not found"}
          </div>
        ) : (
          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {view.banner ? (
              <img
                src={view.banner}
                alt={view.title}
                className="w-full h-72 object-cover"
              />
            ) : null}
            <div className="p-5 md:p-8">
              {view.category ? (
                <div className="text-xs text-gray-500 mb-2">
                  {view.category}
                </div>
              ) : null}
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0e1733] mb-4">
                {view.title}
              </h1>
              <div className="prose max-w-none prose-p:leading-7 prose-img:rounded-xl">
                <p className="text-gray-700 whitespace-pre-line">
                  <DecodedText text={view.description} />
                </p>
              </div>
              <div className="mt-6">
                <Link
                  to="/blog"
                  className="text-sm flex items-center gap-2 font-semibold text-[#0e1733] hover:underline"
                >
                  {lang === "ar" ? "العودة للمدونة" : "Back to Blogs"}
                  <IoArrowBack />
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </>
  );
};

export default BlogDetails;
