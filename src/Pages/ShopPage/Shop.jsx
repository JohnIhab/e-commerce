import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { FiPackage, FiSearch, FiFilter, FiX } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { ApiAuthContext } from "../../context/AuthContext";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { Helmet } from "react-helmet";
import { CategoriesContext } from "../../context/CategoriesContext";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { SettingsContext } from "../../context/Settings";
import { useLocation } from "react-router-dom";

const Shop = () => {
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterSidebarRef = useRef(null);
  const { categories } = useContext(CategoriesContext);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { siteName_ar, siteName_en } = useContext(SettingsContext);
  const location = useLocation();

  const [brands, setBrands] = useState([]);
  const { t } = useTranslation();
  async function getBrands() {
    const response = await axios.get(`${baseUrl}/product-category-brands`, {
      headers: {
        "X-API-KEY": XApiKey,
      },
    });
    return response.data.data.brands.data;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getBrands"],
    queryFn: getBrands,
  });

  useEffect(() => {
    if (data) {
      setBrands(data);
    }
  }, [data]);

  // Sync URL ?search= with local state and trigger fetch
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = params.get("search") || "";
    setQuery(qParam);
    setPage(1);
  }, [location.search]);

  const listEndpoint = useMemo(
    () => `${baseUrl}/products?page=${page}`,
    [baseUrl, page]
  );
  const searchEndpoint = useMemo(() => {
    const params = new URLSearchParams();
    // if (query) params.set( query);
    // if (selectedCategories.length)
    //   params.set( selectedCategories.join(","));
    // if (selectedBrands.length) params.set("brands", selectedBrands.join(","));
    // if (minPrice) params.set("min", String(minPrice));
    // if (maxPrice) params.set("max", String(maxPrice));
    // if (sortKey) params.set("sort_key", sortKey);
    // params.set("page", String(page));
    // console.log(selectedCategories);
    const categoriesParam = selectedCategories.length
      ? `${selectedCategories.join(",")}`
      : "";
    const brandsParam = selectedBrands.length
      ? `${selectedBrands.join(",")}`
      : "";

    return `${baseUrl}/products?search=${query}&categories=${categoriesParam}&brands=${brandsParam}&price_min=${minPrice}&price_max=${maxPrice}&sort=${sortKey}`;
  }, [
    baseUrl,
    query,
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    sortKey,
    page,
  ]);

  async function fetchProducts(useSearch = false) {
    setLoading(true);
    try {
      const url =
        useSearch &&
        (query ||
          selectedCategories.length ||
          selectedBrands.length ||
          minPrice ||
          maxPrice ||
          sortKey)
          ? searchEndpoint
          : listEndpoint;
      const { data } = await axios.get(url, {
        headers: {
          "X-API-KEY": XApiKey,
        },
      });

      setProducts(
        Array.isArray(data.data.products.data) ? data.data.products.data : []
      );
      const last = data.data.products.last_page ?? 1;
      setTotalPages(last);
    } catch {
      toast.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts(
      Boolean(
        query ||
          selectedCategories.length ||
          selectedBrands.length ||
          minPrice ||
          maxPrice ||
          sortKey
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    baseUrl,
    // query,
    // selectedCategories,
    // selectedBrands,
    // minPrice,
    // maxPrice,
    sortKey,
    page,
  ]);

  // Handle clicking outside the filter sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterSidebarRef.current &&
        !filterSidebarRef.current.contains(event.target) &&
        isFilterOpen
      ) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    fetchProducts(true);
  }

  function toggleInArray(id, setter) {
    setter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {lang === "en" ? `${siteName_en} | Shop` : `${siteName_ar}  |  تسوق `}
        </title>
        <meta name="description" content={lang === "en" ? `${siteName_en} | Shop` : `${siteName_ar}  |  تسوق `} />
      </Helmet>
      {/* <div className="flex justify-center py-5">
        <h3 className="text-3xl font-bold flex items-center">
          <FiPackage size={30} className="mx-3" /> {t("shop.All Products")}
        </h3>
      </div> */}

      <div className="relative pt-20">
        {/* Mobile Filter Button */}
        <div className="md:hidden    absolute bottom-0 end-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-4 bg-third text-primary rounded-full"
          >
            <FiFilter size={18} />
          </button>
        </div>

        <div className="flex gap-6 px-4 md:px-8 my-7">
          {/* Desktop Sidebar Filter */}
          <aside className="hidden md:block w-64 shrink-0 h-180 overflow-scroll no-scroll-bar ">
            <div className="bg-primary border border-gray-200 rounded-xl   shadow-sm mb-4">
              <select
                value={sortKey}
                onChange={(e) => {
                  setSortKey(e.target.value);
                  setPage(1);
                  fetchProducts(true);
                }}
                className="w-full border border-gray-300 rounded-lg py-2 px-3"
              >
                <option className="bg-primary" value="">
                  {t("shop.sort.label")}
                </option>
                <option className="bg-primary" value="price_asc">
                  {t("shop.sort.price_asc")}
                </option>
                <option className="bg-primary" value="price_desc">
                  {t("shop.sort.price_desc")}
                </option>
                <option className="bg-primary" value="new_arrival">
                  {t("shop.sort.new_arrival")}
                </option>
                <option className="bg-primary" value="popularity">
                  {t("shop.sort.popularity")}
                </option>
                <option className="bg-primary" value="top_rated">
                  {t("shop.sort.top_rated")}
                </option>
              </select>
            </div>
            <div className="dark:bg-primary dark:text-third border border-gray-200 rounded-xl p-4 shadow-sm">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("search.placeholder")}
                    className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </form>
            </div>

            <div className="dark:bg-primary border border-gray-200 rounded-xl p-4 shadow-sm mt-4">
              <h4 className="text-lg font-semibold mb-3">
                {t("shop.categories")}
              </h4>
              <div className="flex flex-col gap-2 text-sm">
                {categories?.map((c) => (
                  <label key={c.id} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c.id)}
                      onChange={() =>
                        toggleInArray(c.id, setSelectedCategories)
                      }
                    />
                    <span>
                      {lang === "en" ? c.title_en : c.title_ar ?? c.title_en}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="dark:bg-primary border border-gray-200 rounded-xl p-4 shadow-sm mt-4">
              <h4 className="text-lg font-semibold mb-3">{t("shop.brands")}</h4>
              <div className="flex flex-col gap-2 text-sm">
                {brands.map((brand) => (
                  <label
                    key={brand.id}
                    className="inline-flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() =>
                        toggleInArray(brand.id, setSelectedBrands)
                      }
                    />
                    <span>
                      {lang === "en"
                        ? brand.title_en
                        : brand.title_ar ?? brand.title_en}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="dark:bg-primary border border-gray-200 rounded-xl p-4 shadow-sm mt-4">
              <h4 className="text-lg font-semibold mb-3">{t("shop.price")}</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder={t("shop.Min")}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded-lg py-1.5 px-2"
                />
                <input
                  type="number"
                  placeholder={t("shop.Max")}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 border border-gray-300 rounded-lg py-1.5 px-2"
                />
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setPage(1);
                fetchProducts(true);
              }}
              className="mt-3 w-full py-2 bg-third text-primary hover:bg-third/70 transition duration-500 rounded-lg"
            >
              {t("shop.apply")}
            </button>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse dark:bg-primary rounded-xl border border-gray-100 overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-8 mb-8">
              <button
                className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
              >
                {t("pagination.prev")}
              </button>
              <span className="text-sm text-gray-600">
                {t("pagination.page")} {page} {t("pagination.of")} {totalPages}
              </span>
              <button
                className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
              >
                {t("pagination.next")}
              </button>
            </div>
          </main>
        </div>

        {/* Mobile Filter Sidebar */}
        {isFilterOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsFilterOpen(false)}
          >
            <div
              ref={filterSidebarRef}
              className="fixed right-0 top-0 max-h-screen   w-80 dark:bg-primary shadow-xl transform transition-transform duration-300 ease-in-out  no-scroll-bar "
              onClick={(e) => e.stopPropagation()}
             >
              {/* Mobile Filter Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">
                  {t("shop.filterProducts")}
                </h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 text-gray-700 hover:text-gray-900"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Mobile Filter Content */}
              <div className="p-4 overflow-y-auto h-full pb-20 max-h-screen overflow-scroll">
                <div className="dark:bg-primary border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
                  <h4 className="text-lg font-semibold mb-3">
                    {t("shop.sort.label")}
                  </h4>
                  <select
                    value={sortKey}
                    onChange={(e) => {
                      setSortKey(e.target.value);
                      setPage(1);
                      fetchProducts(true);
                      setIsFilterOpen(false);
                    }}
                    className="w-full  border border-gray-300 rounded-lg py-2 px-2"
                  >
                    <option value="">{t("shop.sort.default")}</option>
                    <option value="price_low_to_high">
                      {t("shop.sort.price_asc")}
                    </option>
                    <option value="price_high_to_low">
                      {t("shop.sort.price_desc")}
                    </option>
                    <option value="new_arrival">
                      {t("shop.sort.new_arrival")}
                    </option>
                    <option value="popularity">
                      {t("shop.sort.popularity")}
                    </option>
                    <option value="top_rated">
                      {t("shop.sort.top_rated")}
                    </option>
                  </select>
                </div>
                {/* Search */}
                <div className="dark:bg-primary border border-gray-200 rounded-xl  shadow-sm mb-4">
                   
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center gap-2"
                  >
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("search.placeholder")}
                        className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                     
                  </form>
                </div>

                {/* Categories */}
                <div className="  border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
                  <h4 className="text-lg font-semibold mb-3">
                    {t("shop.categories")}
                  </h4>
                  <div className="flex flex-col gap-2 text-sm">
                    {categories?.map((c) => (
                      <label
                        key={c.id}
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(c.slug_en)}
                          onChange={() =>
                            toggleInArray(c.slug_en, setSelectedCategories)
                          }
                        />
                        <span>
                          {lang === "en"
                            ? c.title_en
                            : c.title_ar ?? c.title_en}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="dark:bg-primary border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
                  <h4 className="text-lg font-semibold mb-3">
                    {t("shop.brands")}
                  </h4>
                  <div className="flex flex-col gap-2 text-sm">
                    {[1, 2, 3, 4].map((id) => (
                      <label
                        key={id}
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(id)}
                          onChange={() => toggleInArray(id, setSelectedBrands)}
                        />
                        <span>Brand {id}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="dark:bg-primary border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
                  <h4 className="text-lg font-semibold mb-3">
                    {t("shop.price")}
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-1/2 border border-gray-300 rounded-lg py-1.5 px-2"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-1/2 border border-gray-300 rounded-lg py-1.5 px-2"
                    />
                  </div>
                </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(1);
                      fetchProducts(true);
                      setIsFilterOpen(false);
                    }}
                    className="mt-3 w-full py-2 bg-third text-primary rounded-lg"
                  >
                    {t("shop.apply")}
                  </button>

                {/* Sort */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;
