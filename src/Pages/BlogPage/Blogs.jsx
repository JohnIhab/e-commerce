import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import { ApiAuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { IoSearch } from "react-icons/io5";
import BlogCategories from "./BlogCategories";
import he from "he";
function DecodedText({ text }) {
  const safeText = typeof text === "string" ? text : "";
  const decodedHtml = he.decode(safeText);

  return <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />;
}
const Blogs = () => {
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]);

  // Get page and category from URL params
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const selectedCategoryId = searchParams.get("category")
    ? parseInt(searchParams.get("category"))
    : null;

  const [pagination, setPagination] = useState({
    last_page: 1,
    total: 0,
    links: [],
  });
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  // const isRTL = lang === "ar";

  // Function to update URL parameters
  const updateURLParams = (newParams) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    setSearchParams(params);
  };

  // Function to handle page change
  const handlePageChange = (page) => {
    updateURLParams({ page });
  };

  // Function to handle category selection
  const handleCategorySelect = (categoryId) => {
    updateURLParams({
      category: categoryId,
      page: 1, // Reset to page 1 when changing category
    });
  };

  // Function to handle search
  const handleSearchChange = (searchValue) => {
    updateURLParams({
      search: searchValue,
      page: 1, // Reset to page 1 when searching
    });
  };

  useEffect(() => {
    let isActive = true;
    async function fetchBlogs() {
      setIsLoading(true);
      setError("");
      try {
        // If selected category is known to be empty, short-circuit to Not Found
        if (
          selectedCategoryId !== null &&
          selectedCategoryId !== undefined &&
          Array.isArray(categories) &&
          categories.length > 0
        ) {
          const selectedCat = categories.find(
            (c) => c.id === selectedCategoryId
          );
          if (selectedCat && selectedCat.blogs_count === 0) {
            if (!isActive) return;
            setBlogs([]);
            setPagination({ last_page: 1, total: 0, links: [] });
            setIsLoading(false);
            return;
          }
        }
        // Build the API endpoint based on whether a category is selected
        let apiUrl = `${baseUrl}/blogs`;

        if (selectedCategoryId !== null && selectedCategoryId !== undefined) {
          // Find the category to get its slug
          const selectedCategory = categories.find(
            (cat) => cat.id === selectedCategoryId
          );
          if (selectedCategory) {
            const slug =
              lang === "ar"
                ? selectedCategory.slug_ar
                : selectedCategory.slug_en;
            if (slug) {
              // Use the category slug endpoint as shown in the image
              apiUrl = `${baseUrl}/blogs/category/${slug}`;
            } else {
              // Fallback: if no slug available, use the old method with category_id
              console.warn(
                "No slug found for category, falling back to category_id parameter"
              );
              params.append("category_id", String(selectedCategoryId));
            }
          }
        }

        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.set("page", String(currentPage));

        // Debug: Log the parameters being sent

        const { data } = await axios.get(`${apiUrl}?${params.toString()}`, {
          headers: { "x-api-key": XApiKey },
        });
        if (!isActive) return;

        // Debug: Log the response data

        const blogsNode = data?.data?.blogs || data?.data || data?.blogs;
        const list = blogsNode?.data || [];
        setBlogs(
          Array.isArray(list) ? list : Array.isArray(blogsNode) ? blogsNode : []
        );
        setPagination({
          last_page: Number(blogsNode?.last_page || 1),
          total: Number(
            blogsNode?.total || (Array.isArray(list) ? list.length : 0)
          ),
          links: Array.isArray(blogsNode?.links) ? blogsNode.links : [],
        });
      } catch {
        if (!isActive) return;
        setError("Failed to load blogs");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    fetchBlogs();
    return () => {
      isActive = false;
    };
  }, [
    baseUrl,
    XApiKey,
    search,
    currentPage,
    selectedCategoryId,
    categories,
    lang,
  ]);

  useEffect(() => {
    let isActive = true;
    async function fetchCategories() {
      setCategoriesLoading(true);
      try {
        const { data } = await axios.get(`${baseUrl}/blog-categories`, {
          headers: { "x-api-key": XApiKey },
        });
        if (!isActive) return;
        const list = data?.data?.categories?.data || [];
        const langLocal = i18n.language?.startsWith("ar") ? "ar" : "en";
        const mapped = list.map((c) => ({
          id: c.id,
          title:
            c[langLocal === "ar" ? "title_ar" : "title_en"] ||
            c.title_en ||
            c.title_ar ||
            "",
          title_en: c.title_en,
          title_ar: c.title_ar,
          slug_en: c.slug_en,
          slug_ar: c.slug_ar,
          meta_title_en: c.meta_title_en,
          meta_title_ar: c.meta_title_ar,
          meta_description_en: c.meta_description_en,
          meta_description_ar: c.meta_description_ar,
          meta_keywords_en: c.meta_keywords_en,
          meta_keywords_ar: c.meta_keywords_ar,
          meta_img: c.meta_img,
          blogs_count: c.blogs_count,
          blogs: Array.isArray(c.blogs) ? c.blogs : [],
        }));
        setCategories(mapped);
      } catch {
        // ignore
      } finally {
        if (isActive) setCategoriesLoading(false);
      }
    }
    fetchCategories();
    return () => {
      isActive = false;
    };
  }, [baseUrl, XApiKey, i18n.language]);

  const pageMeta = useMemo(() => {
    const first = blogs?.[0];
    if (!first)
      return {
        title: "JootBag | Blogs",
        desc: "Browse our latest blogs",
        keywords: "blogs",
      };
    const title =
      first[lang === "ar" ? "meta_title_ar" : "meta_title_en"] ||
      "JootBag | Blogs";
    const desc =
      first[lang === "ar" ? "meta_description_ar" : "meta_description_en"] ||
      "Blogs";
    const keywords =
      first[lang === "ar" ? "meta_keywords_ar" : "meta_keywords_en"] || "blogs";
    const image =
      first["meta_img"] || first[lang === "ar" ? "banner_ar" : "banner_en"];
    return { title, desc, keywords, image };
  }, [blogs, lang]);

  return (
    <>
      <Helmet>
        {<title>{pageMeta.title}</title>}
        <meta name="description" content={pageMeta.desc} />
        <meta name="keywords" content={pageMeta.keywords} />
        {pageMeta.image ? (
          <meta property="og:image" content={pageMeta.image} />
        ) : null}
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.desc} />
      </Helmet>

      <div className="max-w-8xl mx-auto lg:px-20 px-5 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0e1733] tracking-tight">
              {lang === "ar" ? "المدونة" : "Blogs"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {lang === "ar"
                ? "آخر المقالات والأخبار"
                : "Latest articles and news"}
            </p>
          </div>
          <div className="w-full md:w-auto">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleSearchChange(e.target.value);
                }}
                placeholder={lang === "ar" ? "ابحث في المدونة" : "Search blogs"}
                className={`w-full md:w-80 border border-gray-300 focus:border-[#0e1733] rounded-lg py-2 text-sm focus:outline-none focus:ring-0 transition-colors ${
                  lang === "ar" ? "pl-10 pr-3" : "pr-10 pl-3"
                }`}
              />
              <span
                className={`pointer-events-none absolute inset-y-0 flex items-center text-gray-400 ${
                  lang === "ar" ? "left-3" : "right-3"
                }`}
              >
                <IoSearch size={20} />
              </span>
            </div>
          </div>
        </div>

        <div className="lg:flex gap-6 items-start px-5 md:px-6">
          <div className="w-full lg:w-96 shrink-0">
            <BlogCategories
              title={lang === "ar" ? "الفئات" : "Categories"}
              categories={categories}
              loading={categoriesLoading}
              selectedId={selectedCategoryId}
              onSelect={(id) => {
                // Clear current list and show loader while fetching
                setIsLoading(true);
                setBlogs([]);
                handleCategorySelect(id);
              }}
            />
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse"
                  >
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-10 text-red-600">{error}</div>
            ) : blogs.length === 0 ? (
              <div className="py-16 w-full flex items-center justify-center">
                <div className="max-w-xl w-full bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                  <p className="text-gray-700 text-lg font-semibold mb-1">
                    {selectedCategoryId
                      ? lang === "ar"
                        ? "لا توجد نتائج لهذه الفئة"
                        : "No results for this category"
                      : lang === "ar"
                      ? "لا توجد مقالات"
                      : "No blogs found"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {lang === "ar"
                      ? "حاول تغيير الفئة أو بحث مختلف"
                      : "Try a different category or search term"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((b) => {
                    const title =
                      lang === "ar"
                        ? b.title_ar || b.title_en || ""
                        : b.title_en || b.title_ar || "";
                    const short =
                      lang === "ar"
                        ? b.short_description_ar || b.description_ar || ""
                        : b.short_description_en || b.description_en || "";
                    const banner =
                      b[lang === "ar" ? "banner_ar" : "banner_en"] ||
                      b.meta_img;
                    const category =
                      b?.blog_category?.[
                        lang === "ar" ? "title_ar" : "title_en"
                      ];
                    const createdAt = b?.created_at;
                    const slugValue =
                      lang === "ar"
                        ? b?.slug_ar || b?.slug_en
                        : b?.slug_en || b?.slug_ar;
                    const detailsPath = slugValue
                      ? `/blog/${encodeURIComponent(slugValue)}`
                      : null;
                    return (
                      <article
                        key={b.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                      >
                        {banner ? (
                          <div className="relative">
                            {detailsPath ? (
                              <Link to={detailsPath}>
                                <img
                                  src={banner}
                                  alt={title}
                                  className="w-full h-48 object-cover"
                                />
                              </Link>
                            ) : (
                              <img
                                src={banner}
                                alt={title}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            {category ? (
                              <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
                                {category}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                        <div className="p-4 flex flex-col flex-1">
                          {detailsPath ? (
                            <Link to={detailsPath}>
                              <h2 className="text-lg font-bold text-[#0e1733] mb-2 line-clamp-2">
                                {title}
                              </h2>
                            </Link>
                          ) : (
                            <h2 className="text-lg font-bold text-[#0e1733] mb-2 line-clamp-2">
                              {title}
                            </h2>
                          )}
                          <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                            <DecodedText text={short} />
                          </p>
                          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                            <span>{createdAt}</span>
                            {detailsPath ? (
                              <Link
                                to={detailsPath}
                                className="text-sm font-semibold text-[#0e1733] hover:underline"
                              >
                                {lang === "ar" ? "اقرأ المزيد" : "Read more"}
                              </Link>
                            ) : (
                              <span className="text-sm text-gray-400">
                                {lang === "ar" ? "غير متاح" : "Unavailable"}
                              </span>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={`px-3 py-2 rounded border text-sm ${
                      currentPage <= 1
                        ? "text-gray-400 border-gray-200"
                        : "text-[#0e1733] border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {lang === "ar" ? "السابق" : "Previous"}
                  </button>
                  {Array.from({
                    length: Math.min(5, pagination.last_page),
                  }).map((_, idx) => {
                    const half = 3;
                    let start = Math.max(1, currentPage - (half - 1));
                    let end = Math.min(pagination.last_page, start + 4);
                    start = Math.max(1, end - 4);
                    const page = start + idx;
                    if (page > pagination.last_page) return null;
                    const isActive = page === currentPage;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`min-w-9 px-3 py-2 rounded border text-sm ${
                          isActive
                            ? "bg-[#0e1733] text-white border-[#0e1733]"
                            : "text-[#0e1733] border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    disabled={currentPage >= pagination.last_page}
                    onClick={() =>
                      handlePageChange(
                        Math.min(pagination.last_page, currentPage + 1)
                      )
                    }
                    className={`px-3 py-2 rounded border text-sm ${
                      currentPage >= pagination.last_page
                        ? "text-gray-400 border-gray-200"
                        : "text-[#0e1733] border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {lang === "ar" ? "التالي" : "Next"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blogs;
