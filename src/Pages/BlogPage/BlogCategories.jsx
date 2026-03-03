import React from "react";
import { Helmet } from "react-helmet";

const BlogCategories = ({
  title = "Categories",
  categories = [],
  loading = false,
  selectedId = null,
  onSelect = () => {},
}) => {
  // Use first category meta tags where available
  const firstWithMeta = Array.isArray(categories)
    ? categories.find(
        (c) =>
          c?.meta_title_en ||
          c?.meta_title_ar ||
          c?.meta_description_en ||
          c?.meta_description_ar
      )
    : null;
  const metaTitle =
    firstWithMeta?.meta_title_ar ||
    firstWithMeta?.meta_title_en ||
    `${title} | JootBag`;
  const metaDesc =
    firstWithMeta?.meta_description_ar ||
    firstWithMeta?.meta_description_en ||
    `${title} - filter blogs by category`;
  const metaKeywords =
    firstWithMeta?.meta_keywords_ar ||
    firstWithMeta?.meta_keywords_en ||
    undefined;
  const metaImg = firstWithMeta?.meta_img || undefined;

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        {metaKeywords ? <meta name="keywords" content={metaKeywords} /> : null}
        {metaImg ? <meta property="og:image" content={metaImg} /> : null}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
      </Helmet>
      <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5 w-full">
        <h3 className="text-lg font-extrabold text-[#0e1733] tracking-tight mb-4">
          {title}
        </h3>
        {loading ? (
          <ul className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="h-9 bg-gray-100 rounded animate-pulse" />
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onSelect(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-colors ${
                  selectedId === null
                    ? "bg-[#0e1733] text-white border-[#0e1733]"
                    : "text-[#0e1733] border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span>All</span>
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => onSelect(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-colors ${
                    selectedId === cat.id
                      ? "bg-[#0e1733] text-white border-[#0e1733]"
                      : "text-[#0e1733] border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{cat.title}</span>
                  {typeof cat.blogs_count === "number" ? (
                    <span
                      className={`ml-2 inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs font-semibold ${
                        selectedId === cat.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cat.blogs_count}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  );
};

export default BlogCategories;
