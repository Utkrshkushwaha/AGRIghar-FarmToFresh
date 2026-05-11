import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { createProduct, updateProduct, getProductById } from "../api/axios";
import { FaLeaf, FaArrowLeft, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";

const CATEGORIES = ["vegetables", "fruits", "grains", "dairy", "spices", "other"];
const UNITS      = ["kg", "piece", "dozen", "liter", "bundle", "quintal"];

const AddEditProduct = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // if id exists → edit mode
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "", category: "vegetables", price: "", unit: "kg",
    quantity: "", description: "", isOrganic: false, isAvailable: true,
  });
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(isEdit);

  useEffect(() => {
    if (!user || user.role !== "farmer") { navigate("/"); return; }
    if (isEdit) {
      getProductById(id)
        .then((res) => setForm(res.data))
        .catch(() => toast.error("Failed to load product"))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.quantity) {
      toast.error("Please fill all required fields"); return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await updateProduct(id, form);
        toast.success("Product updated!");
      } else {
        await createProduct(form);
        toast.success("Product listed successfully! 🌿");
      }
      navigate("/farmer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
      // Demo: navigate anyway
      navigate("/farmer/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="card p-6 space-y-4">
        {[1,2,3,4].map((i) => <div key={i} className="h-10 bg-gray-200 rounded" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <FaArrowLeft /> Back to Dashboard
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-600 text-white p-2.5 rounded-xl">
          <FaLeaf className="text-lg" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Product" : t("addProduct")}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEdit ? "Update your product listing" : "List your farm produce for sale"}
          </p>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("productName")} <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Fresh Tomatoes, Alphonso Mangoes"
              className="input-field" required />
          </div>

          {/* Category & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("category")} <span className="text-red-500">*</span></label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{t(c)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("unit")} <span className="text-red-500">*</span></label>
              <select name="unit" value={form.unit} onChange={handleChange} className="input-field">
                {UNITS.map((u) => (
                  <option key={u} value={u}>{t(u) || u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("price")} (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input type="number" name="price" value={form.price} onChange={handleChange}
                  placeholder="0" min="1" className="input-field pl-7" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Available Stock <span className="text-red-500">*</span>
              </label>
              <input type="number" name="quantity" value={form.quantity} onChange={handleChange}
                placeholder="0" min="0" className="input-field" required />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("description")}</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe your product — freshness, growing method, harvest date..."
              rows={3} className="input-field resize-none" />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" name="isOrganic" checked={form.isOrganic} onChange={handleChange}
                className="accent-primary-600 w-4 h-4" />
              <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">
                🌿 Organic Product
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange}
                className="accent-primary-600 w-4 h-4" />
              <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">
                ✅ Available for Sale
              </span>
            </label>
          </div>

          {/* Price Preview */}
          {form.price && form.unit && (
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <p className="text-sm text-primary-700 font-medium">Price Preview</p>
              <p className="text-2xl font-bold text-primary-800 mt-1">
                ₹{form.price} <span className="text-base font-normal text-primary-600">per {form.unit}</span>
              </p>
              {form.isOrganic && (
                <p className="text-xs text-primary-600 mt-1 flex items-center gap-1">
                  <FaLeaf /> Organic badge will be shown
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1 py-3">
              {t("cancel")}
            </button>
            <button type="submit" disabled={loading}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60">
              <FaSave />
              {loading ? "Saving..." : (isEdit ? t("save") : "List Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProduct;
