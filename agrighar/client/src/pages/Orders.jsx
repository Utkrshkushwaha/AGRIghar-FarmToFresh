import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../api/axios";
import OrderStatusStepper from "../components/OrderStatusStepper";
import { FaBoxOpen, FaArrowRight } from "react-icons/fa";

const STATUS_COLORS = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  dispatched: "bg-orange-100 text-orange-700",
  delivered:  "bg-green-100 text-green-700",
};

const Orders = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getMyOrders()
      .then((res) => {
        // Remove duplicates by _id
        const unique = Array.from(
          new Map((res.data || []).map((o) => [o._id, o])).values()
        );
        setOrders(unique);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🔒</div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">Please Login</h2>
      <Link to="/login" className="btn-primary px-8 py-3">Login</Link>
    </div>
  );

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      {[1,2,3].map((i) => (
        <div key={i} className="card p-5 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaBoxOpen className="text-primary-600" /> {t("orders")}
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("noOrders")}</h3>
          <p className="text-gray-500 mb-6">Start shopping from local farmers!</p>
          <Link to="/browse" className="btn-primary px-8 py-3">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card overflow-hidden">
              {/* Order Header */}
              <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Order ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Date</p>
                  <p className="text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Total</p>
                  <p className="text-sm font-bold text-primary-700">₹{order.totalAmount}</p>
                </div>
                <span className={`badge ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"} capitalize`}>
                  {t(order.status)}
                </span>
                <button onClick={() => setSelected(selected === order._id ? null : order._id)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                  {selected === order._id ? "Hide" : "Track"} <FaArrowRight className="text-xs" />
                </button>
              </div>

              {/* Items */}
              <div className="px-4 py-3 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {order.items?.map((item, i) => (
                    <span key={i} className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full">
                      {item.name} × {item.qty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tracking */}
              {selected === order._id && (
                <div className="p-4 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">{t("trackOrder")}</h3>
                  <OrderStatusStepper status={order.status} />
                  <div className="mt-3 bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-0.5">Delivery Address</p>
                    <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
