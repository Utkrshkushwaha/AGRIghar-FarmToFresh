import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../api/axios";
import { FaLeaf, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const Register = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", address: "", role: "consumer",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (!form.name || !form.email) { toast.error("Please fill all required fields"); return; }
    setLoading(true);

    // Try real backend first
    try {
      const { confirmPassword, ...payload } = form;
      const res = await registerUser(payload);
      login(res.data.user, res.data.token);
      toast.success(t("registerSuccess"));
      navigate(res.data.user.role === "farmer" ? "/farmer/dashboard" : "/browse");
    } catch (err) {
      // Demo mode — works without backend
      const newUser = {
        _id: "user_" + Date.now(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        role: form.role,
      };
      setTimeout(() => {
        login(newUser, "demo_token_" + form.role);
        toast.success("Account created! Welcome, " + form.name + "! 🎉");
        navigate(form.role === "farmer" ? "/farmer/dashboard" : "/browse");
        setLoading(false);
      }, 800);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="bg-primary-600 text-white p-2 rounded-xl">
              <FaLeaf className="text-xl" />
            </div>
            <span className="text-2xl font-bold text-primary-700">
              AGRI<span className="text-accent-500">ghar</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join the AGRIghar community</p>
        </div>

        <div className="card p-8">
          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "consumer", label: "Consumer", emoji: "🛒" },
                { value: "farmer",   label: "Farmer",   emoji: "👨‍🌾" },
                { value: "vendor",   label: "Vendor",   emoji: "🏪" },
              ].map((r) => (
                <button key={r.value} type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                    form.role === r.value
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}>
                  <span className="text-xl">{r.emoji}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("name")}</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Your full name" className="input-field pl-10" required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("email")}</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className="input-field pl-10" required />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("phone")}</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" className="input-field pl-10" />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("address")}</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 text-sm" />
                <textarea name="address" value={form.address} onChange={handleChange}
                  placeholder="Village / City, District, State"
                  rows={2} className="input-field pl-10 resize-none" />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("password")}</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                    placeholder="Min 6 chars" className="input-field pl-10 pr-8" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                    placeholder="Repeat password" className="input-field pl-10" required />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-60">
              {loading ? "Creating account..." : t("register")}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">{t("login")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
