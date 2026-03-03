import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
// import mac from "../../assets/profile/orders/mac.png";
// import iphone from "../../assets/profile/orders/iphone.png";
import { LuPackage, LuPackageCheck, LuPackageX } from "react-icons/lu";
import { TbTruckReturn } from "react-icons/tb";
import Loader from "../../Components/Loader";
import { ApiAuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { baseUrl, XApiKey } = useContext(ApiAuthContext);
  const queryClient = useQueryClient();
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const params = new URLSearchParams(location.search);
  const initialPage = parseInt(params.get("page")) || 1;
  const [page, setPage] = useState(initialPage);

  const { t, i18n } = useTranslation();
  

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (page !== parseInt(params.get("page"))) {
    params.set("page", page);
    navigate({ search: params.toString() }, { replace: true });
  }
}, [page]);


  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (page !== parseInt(params.get("page"))) {
      params.set("page", page);
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [page]);
  const fetchOrders = async ({ queryKey }) => {
    const [_key, page] = queryKey;
    const headers = {
      "X-API-KEY": XApiKey,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const response = await axios.get(`${baseUrl}/orders?page=${page}`, { headers });
    return response.data.data;
  };

  const { data: ordersPage, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["Orders", page],
    queryFn: fetchOrders,
    keepPreviousData: true,
  });

  const lastPage = ordersPage?.last_page ?? 1;

  async function handleFindByCode() {
    if (!searchCode) return;
    try {
      setSearchResult(null);
      const headers = {
        "X-API-KEY": XApiKey,
        Authorization: "Bearer " + localStorage.getItem("token"),
      };
      const res = await axios.get(`${baseUrl}/orders/${encodeURIComponent(searchCode)}`, { headers });
      setSearchResult(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || t('orders.Order not found'));
    }
  }

  async function handleCancel(orderId) {
    if (!orderId) return;
    try {
      setCancellingId(orderId);
      const headers = {
        "X-API-KEY": XApiKey,
        Authorization: "Bearer " + localStorage.getItem("token"),
      };
      const res = await axios.post(`${baseUrl}/orders/cancel/${orderId}`, {}, { headers });
      toast.success(res.data?.message || "Order canceled");
      // refetch current page
      queryClient.invalidateQueries(["Orders", page]);
      setConfirmCancelId(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || t('orders.Cancel failed'));
    } finally {
      setCancellingId(null);
    }
  }

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-sm text-red-300">{t('orders.Error')}: {error?.message}</p>;

  const orders = ordersPage?.data || [];

  function formatPrice(order) {
    const symbol = order?.converted?.symbol_en || "";
    const value = order?.converted?.converted_price?.grand_total ?? order?.grand_total;
    return `${symbol} ${value}`;
  }

  function productImageFor(item) {
    const product = item.product || {};
    const lang = i18n?.language || "en";
    const banner = lang && String(lang).toLowerCase().startsWith("ar") ? product.banner_ar || product.banner_en : product.banner_en || product.banner_ar;
    if (banner) return banner;
  }

  function isCanceled(order) {
    if (!order || !order.order_status) return false;
    const s = String(order.order_status).toLowerCase();
    return s === "canceled" || s === "cancelled";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center gap-2"><LuPackage size={22} />{t('orders.title')}</h3>
        <div className="text-sm text-gray-400">{isFetching ? "Refreshing..." : ""}</div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
        <div className="flex-1 flex items-center gap-2">
          <input
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder={t('orders.Search by order code e.g. ORD-...')}
            className="w-full md:w-80 px-3 py-2 rounded bg-transparent border text-sm"
          />
          <button onClick={handleFindByCode} className="px-3 py-2 bg-third text-primary rounded text-sm">{t('orders.Find')}</button>
          <button onClick={() => { setSearchCode(""); setSearchResult(null); queryClient.invalidateQueries(["Orders", page]); }} className="px-3 py-2 bg-gray-600 text-primary rounded text-sm">{t('orders.Refresh')}</button>
        </div>
        {/* Pagination moved to bottom */}
      </div>

      {searchResult && (
        <div className="bg-third text-primary p-4 rounded-lg">
          <h4 className="font-bold mb-2">{t('orders.Search Result')}</h4>
          <div className="space-y-3">
            <div className="p-4 bg-third rounded-lg shadow">
              <div className="flex items-start gap-4">
                <img src={(searchResult.items[0] && productImageFor(searchResult.items[0])) || mac} alt="prod" className="w-28 h-20 object-contain rounded" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-300">{searchResult.created_at}</div>
                      <div className="text-lg font-semibold ">{searchResult.order_code}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{formatPrice(searchResult)}</div>
                      <div className={`inline-block mt-1 px-2 py-1 text-xs rounded ${searchResult.order_status === 'canceled' ? 'bg-red-600' : 'bg-green-600'}`}>{searchResult.order_status}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-300">
                    {searchResult.items.length === 0 ? <div>{t('orders.No items')}</div> : (
                      <ul className="space-y-2">
                        {searchResult.items.map((it) => (
                          <li key={it.id} className="flex items-center gap-3">
                            <img src={productImageFor(it)} alt="i" className="w-10 h-10 object-contain rounded" />
                            <div className="flex-1">
                              <div>{t('orders.Price')}: {it.price} x {it.quantity}</div>
                              <div className="text-xs text-gray-400">{t('orders.Shipping')}: {it.shipping_cost}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {!isCanceled(searchResult) && (
                      <button onClick={() => setConfirmCancelId(searchResult.id)} className="px-3 py-1 rounded bg-red-600 text-primary">{t('orders.Cancel Order')}</button>
                    )}
                    <button onClick={() => navigator.clipboard?.writeText(searchResult.order_code) && toast.success(t('orders.Copied code'))} className="px-3 py-1 rounded bg-gray-700 text-primary">{t('orders.Copy Code')}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.length === 0 && <div className="text-sm text-gray-300">{t('orders.No orders found.')}</div>}

        {orders.map((order) => (
          <div key={order.id} className="p-4 bg-third rounded-lg shadow">
            <div className="flex items-start gap-4">
              <img src={(order.items[0] && productImageFor(order.items[0])) || mac} alt="prod" className="w-28 h-20 object-contain rounded" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-300">{order.created_at}</div>
                    <div className="text-lg font-semibold text-primary">{order.order_code}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-primary">{formatPrice(order)}</div>
                    <div className={`inline-block mt-1 px-2 py-1 text-xs rounded ${order.order_status === 'canceled' ? 'bg-red-600' : 'bg-green-600'}`}>{order.order_status}</div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-300">
                  {order.items.length === 0 ? <div>{t('orders.No items')}</div> : (
                    <ul className="space-y-2">
                      {order.items.map((it) => (
                        <li key={it.id} className="flex items-center gap-3">
                          <img src={productImageFor(it)} alt="i" className="w-10 h-10 object-contain rounded" />
                          <div className="flex-1">
                            <div>{t('orders.Price')}: {it.price} x {it.quantity}</div>
                            <div className="text-xs text-gray-400">{t('orders.Shipping')}: {it.shipping_cost}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {!isCanceled(order) && (
                    <button onClick={() => setConfirmCancelId(order.id)} className="px-3 py-1 rounded bg-red-600 text-primary">{t('orders.Cancel')}</button>
                  )}
                  <button onClick={() => navigator.clipboard?.writeText(order.order_code) && toast.success(t('orders.Copied code'))} className="px-3 py-1 rounded bg-gray-700 text-primary">{t('orders.Copy Code')}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls at bottom */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className={`px-3 py-2 rounded ${page <= 1 ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-gray-700 text-primary'}`}>
          {t('orders.Prev')}
        </button>

        <div className="px-4 py-2 bg-transparent border rounded text-sm">{t('orders.Page')} {page} {t('orders.of')} {lastPage}</div>

        <button
          onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
          disabled={page >= lastPage}
          className={`px-3 py-2 rounded ${page >= lastPage ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-gray-700 text-primary'}`}>
          {t('orders.Next')}
        </button>
      </div>

      {/* Confirm cancel modal */}
      {confirmCancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmCancelId(null)} />
          <div className="relative z-10 bg-primary dark:bg-third p-5 rounded shadow-md w-full max-w-md">
            <h4 className="font-semibold text-primary">{t('orders.Confirm Cancellation')}</h4>
            <p className="text-sm text-gray-500 mt-2">{t('orders.Are you sure you want to cancel this order?')}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmCancelId(null)} className="px-3 py-1 rounded bg-gray-200">{t('orders.No')}</button>
              <button onClick={() => handleCancel(confirmCancelId)} disabled={cancellingId === confirmCancelId} className="px-3 py-1 rounded bg-red-600 text-primary">{cancellingId === confirmCancelId ? t('orders.Cancelling...') : t('orders.Yes, cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
