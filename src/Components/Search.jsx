import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiAuthContext } from "../context/AuthContext";
import Loader from "./Loader";

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const { i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-search", handleOpen);
    return () => window.removeEventListener("open-search", handleOpen);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      // focus input after open
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const close = () => setIsOpen(false);

  // Debounced search as user types (no redirect)
  useEffect(() => {
    let active = true;
    const query = (q || "").trim();
    if (!isOpen) return;
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const url = `${baseUrl}/products?search=${encodeURIComponent(query)}&page=1`;
        const { data } = await axios.get(url, { headers: { "X-API-KEY": XApiKey } });
        if (!active) return;
        const items = data?.data?.products?.data ?? [];
        setResults(Array.isArray(items) ? items : []);
      } catch (_) {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [q, isOpen, baseUrl, XApiKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
      />
      <div className="absolute inset-x-0 top-24 mx-auto max-w-2xl px-4">
        <form onSubmit={(e)=>e.preventDefault()} className="flex items-center gap-3 bg-white/95 border border-gray-200 shadow-xl rounded-full px-5 py-3">
          <FiSearch className="text-gray-500" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
          />
          <button type="button" onClick={close} className="p-1 text-gray-500 hover:text-black">
            <FiX size={20} />
          </button>
        </form>
        {/* Results List */}
        {(loading || q.trim()) && (
          <div className="mt-3 bg-white/95 border border-gray-200 shadow-xl rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-4 text-sm text-gray-600">
                <Loader/>
              </div>
            ) : results.length === 0 && q.trim() ? (
              <div className="p-4 text-sm flex items-center justify-center text-gray-600">{t('noResults') || 'No results found'}</div>
            ) : (
              <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                {results.map((p) => {
                const img = (lang === 'en' ? p?.banner_en : p?.banner_ar ?? p?.banner_en) || p?.thumbnail_image || p?.thumbnail;
                const name = (lang === 'en' ? p?.title_en : p?.title_ar ?? p?.title_en) || 'Product';
                const detailsHref = `/details/${p?.slug_en ?? ''}`;
                return (
                  <li key={p.id}>
                    <Link
                      to={detailsHref}
                      onClick={close}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50"
                    >
                      <div className="w-30 h-30 rounded-md bg-gray-50 overflow-hidden shrink-0">
                        <img src={img} alt={name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{name}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
