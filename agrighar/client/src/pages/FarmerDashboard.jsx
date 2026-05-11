import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { getFarmerProducts, deleteProduct, getFarmerOrders, updateOrderStatus } from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlus, FaEdit, FaTrash, FaBoxOpen,
  FaRupeeSign, FaChartBar, FaLeaf, FaSync
} from "react-icons/fa";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  dispatched: "bg-orange-100 text-orange-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-600",
};

const NEXT_STATUS = {
  pending:    "confirmed",
  confirmed:  "dispatched",
  dispatched: "delivered",
};

const NEXT_LABEL = {
  pending:    "✅ Confirm Order",
  confirmed:  "🚚 Mark Dispatched",
  dispatched: "📦 Mark Delivered",
};

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts]   = useState([]);
  const [orders, setOrders]       = useState([]);
  const [tab, setTab]             = useState("overview");
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (showRefresh = false) => {
    if (!user || user.role !== "farmer") { navigate("/"); return; }
    if (showRefresh) setRefreshing(true);
    try {
      const [pRes, oRes] = await Promise.all([
        getFarmerProducts(),
        getFarmerOrders(),
      ]);
      setProducts(pRes.data || []);
      // Remove duplicate orders by _id
      const uniqueOrders = Array.from(
        new Map((oRes.data || []).map((o) => [o._id, o])).values()
      );
      setOrders(uniqueOrders);
    } catch (err) {
      // If backend not connected show empty state
      setProducts([]);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o)
      );
      toast.success(`Order marked as ${newStatus} ✅`);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  // Correct earnings — only count farmer's items in delivered orders
  const totalEarnings = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => {
      const myItems = (o.items || []).filter(
        (i) => i.farmerId === user?._id || i.farmerId?.toString() === user?._id?.toString()
      );
      if (myItems.length > 0) {
        return sum + myItems.reduce((s, i) => s + i.price * i.qty, 0);
      }
      return sum + (o.totalAmount || 0);
    }, 0);

  const pendingOrders  = orders.filter((o) => o.status === "pending").length;
  const activeListings = products.filter((p) => p.isAvailable).length;
  const totalRevenue   = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + (o.totalAmount || 0), 0);

  const TABS = [
    { key: "overview", label: "Overview",     icon: FaChartBar },
    { key: "products", label: "My Listings",  icon: FaLeaf },
    { key: "orders",   label: `Orders ${orders.length > 0 ? `(${orders.length})` : ""}`, icon: FaBoxOpen },
  ];

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t("farmerDashboard")}</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Welcome back, <span className="font-semibold text-primary-600">{user?.name}</span> 👨‍🌾
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Refresh"
          >
            <FaSync className={refreshing ? "animate-spin" : ""} />
          </button>
          <Link to="/farmer/add-product" className="btn-primary flex items-center gap-2">
            <FaPlus /> {t("addProduct")}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Earnings",  value: `₹${totalEarnings}`, icon: FaRupeeSign, color: "bg-green-50 text-green-600",   border: "border-green-200" },
          { label: "Active Listings", value: activeListings,       icon: FaLeaf,      color: "bg-primary-50 text-primary-600", border: "border-primary-200" },
          { label: "Pending Orders",  value: pendingOrders,        icon: FaBoxOpen,   color: "bg-yellow-50 text-yellow-600", border: "border-yellow-200" },
          { label: "Total Orders",    value: orders.length,        icon: FaChartBar,  color: "bg-blue-50 text-blue-600",    border: "border-blue-200" },
        ].map((stat) => (
          <div key={stat.label} className={`card p-4 border ${stat.border}`}>
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="text-lg" />
            </div>
            <p className="text-2xl font-extrabold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map((tab_) => (
          <button key={tab_.key} onClick={() => setTab(tab_.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === tab_.key
                ? "bg-white text-primary-700 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            <tab_.icon className="text-xs" /> {tab_.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recent Orders */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Recent Orders</h3>
              {orders.length > 0 && (
                <button onClick={() => setTab("orders")}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  View All →
                </button>
              )}
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-sm text-gray-500">No orders yet</p>
                <p className="text-xs text-gray-400 mt-1">Orders will appear when consumers buy your products</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{order.consumerName || "Consumer"}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {order.items?.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                      </p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-sm font-bold text-primary-700">₹{order.totalAmount}</p>
                      <span className={`badge text-xs ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Summary */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Product Summary</h3>
              <button onClick={() => setTab("products")}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                Manage →
              </button>
            </div>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🌱</div>
                <p className="text-sm text-gray-500">No products listed yet</p>
                <Link to="/farmer/add-product"
                  className="text-xs text-primary-600 font-medium mt-1 inline-block hover:text-primary-700">
                  + Add your first product
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">₹{p.price}/{p.unit} · Stock: {p.quantity || 0}</p>
                    </div>
                    <span className={`badge ml-2 flex-shrink-0 ${p.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {p.isAvailable ? "Live" : "Off"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Revenue Summary */}
          <div className="card p-5 md:col-span-2">
            <h3 className="font-bold text-gray-800 mb-4">Revenue Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue",   value: `₹${totalRevenue}`,  color: "text-blue-600" },
                { label: "Earned (Delivered)", value: `₹${totalEarnings}`, color: "text-green-600" },
                { label: "Products Listed", value: products.length,     color: "text-primary-600" },
                { label: "Completed Orders",value: orders.filter((o) => o.status === "delivered").length, color: "text-purple-600" },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className={`text-xl font-extrabold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {tab === "products" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {products.length} product{products.length !== 1 ? "s" : ""} listed
              {activeListings > 0 && ` · ${activeListings} active`}
            </p>
            <Link to="/farmer/add-product" className="btn-primary text-sm flex items-center gap-1.5 py-2">
              <FaPlus className="text-xs" /> Add New Product
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-7xl mb-4">🌱</div>
              <h3 className="font-semibold text-gray-700 mb-2">No products yet</h3>
              <p className="text-gray-500 text-sm mb-6">Start listing your farm produce to reach consumers!</p>
              <Link to="/farmer/add-product" className="btn-primary px-8 py-3">
                <FaPlus className="inline mr-2" /> Add First Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p._id} className="card p-4 hover:border-primary-200 border border-transparent transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-800 truncate">{p.name}</h3>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">{p.category}</p>
                    </div>
                    <span className={`badge ml-2 flex-shrink-0 ${p.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {p.isAvailable ? "Live ✅" : "Offline"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl font-bold text-primary-700">
                      ₹{p.price}
                      <span className="text-xs font-normal text-gray-500">/{p.unit}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      (p.quantity || 0) > 10
                        ? "bg-green-50 text-green-700"
                        : (p.quantity || 0) > 0
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      Stock: {p.quantity || 0} {p.unit}
                    </span>
                    {p.isOrganic && (
                      <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                        🌿 Organic
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/farmer/edit-product/${p._id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-primary-50 hover:bg-primary-100 text-primary-700 py-2 rounded-lg transition-colors font-medium">
                      <FaEdit className="text-xs" /> Edit
                    </Link>
                    <button onClick={() => handleDelete(p._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition-colors font-medium">
                      <FaTrash className="text-xs" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {tab === "orders" && (
        <div>
          {/* Filter summary */}
          {orders.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {["all","pending","confirmed","dispatched","delivered"].map((s) => {
                const count = s === "all" ? orders.length : orders.filter((o) => o.status === s).length;
                return (
                  <span key={s} className={`badge capitalize cursor-default ${
                    s === "all" ? "bg-gray-100 text-gray-700" : STATUS_COLORS[s] || "bg-gray-100 text-gray-700"
                  }`}>
                    {s}: {count}
                  </span>
                );
              })}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-7xl mb-4">📦</div>
              <h3 className="font-semibold text-gray-700 mb-2">No orders yet</h3>
              <p className="text-gray-500 text-sm">Orders will appear here once consumers buy your products.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">{order.consumerName || "Consumer"}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        #{order._id?.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-700 text-xl">₹{order.totalAmount}</p>
                      <span className={`badge capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {order.items?.map((item, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                        {item.name} × {item.qty}
                      </span>
                    ))}
                  </div>

                  {/* Delivery address */}
                  {order.deliveryAddress && (
                    <p className="text-xs text-gray-500 mb-3 bg-gray-50 px-3 py-2 rounded-lg">
                      📍 {order.deliveryAddress}
                    </p>
                  )}

                  {/* Action button */}
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, NEXT_STATUS[order.status])}
                      className="btn-primary text-sm py-2 px-5"
                    >
                      {NEXT_LABEL[order.status]}
                    </button>
                  )}
                  {order.status === "delivered" && (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">
                      ✅ Order Completed
                    </span>
                  )}
                  {order.status === "cancelled" && (
                    <span className="inline-flex items-center gap-1 text-sm text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg">
                      ❌ Order Cancelled
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
