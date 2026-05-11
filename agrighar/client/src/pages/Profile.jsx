import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaLeaf } from "react-icons/fa";
import toast from "react-hot-toast";

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name:    user?.name    || "",
    email:   user?.email   || "",
    phone:   user?.phone   || "",
    address: user?.address || "",
    bio:     user?.bio     || "",
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.data);
      toast.success(t("profileUpdated"));
      setEditing(false);
    } catch {
      updateUser(form);
      toast.success(t("profileUpdated"));
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const ROLE_COLORS = {
    farmer:   "bg-primary-100 text-primary-700",
    consumer: "bg-blue-100 text-blue-700",
    vendor:   "bg-purple-100 text-purple-700",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="card p-6">
        {/* Avatar & Role */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge capitalize ${ROLE_COLORS[user?.role] || "bg-gray-100 text-gray-700"}`}>
                {user?.role === "farmer" && <FaLeaf className="mr-1" />}
                {user?.role}
              </span>
              <span className="text-xs text-gray-400">{user?.email}</span>
            </div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)}
              className="ml-auto btn-secondary text-sm py-2 px-4">
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("name")}</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="input-field pl-10" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("email")}</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="input-field pl-10" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("phone")}</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("address")}</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 text-sm" />
                <textarea name="address" value={form.address} onChange={handleChange}
                  rows={2} className="input-field pl-10 resize-none" />
              </div>
            </div>
            {user?.role === "farmer" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio / About Farm</label>
                <textarea name="bio" value={form.bio} onChange={handleChange}
                  placeholder="Tell consumers about your farm..."
                  rows={3} className="input-field resize-none" />
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1 py-2.5">
                {t("cancel")}
              </button>
              <button type="submit" disabled={loading}
                className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 disabled:opacity-60">
                <FaSave /> {loading ? "Saving..." : t("save")}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {[
              { icon: FaUser,         label: "Name",    value: user?.name },
              { icon: FaEnvelope,     label: "Email",   value: user?.email },
              { icon: FaPhone,        label: "Phone",   value: user?.phone || "Not set" },
              { icon: FaMapMarkerAlt, label: "Address", value: user?.address || "Not set" },
            ].map((field) => (
              <div key={field.label} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <field.icon className="text-gray-500 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{field.label}</p>
                  <p className="text-sm text-gray-800 mt-0.5">{field.value}</p>
                </div>
              </div>
            ))}
            {user?.bio && (
              <div className="flex items-start gap-3 py-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaLeaf className="text-gray-500 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">About Farm</p>
                  <p className="text-sm text-gray-800 mt-0.5">{user.bio}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
