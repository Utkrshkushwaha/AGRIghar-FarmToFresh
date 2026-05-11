import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/axios";
import { FaLeaf, FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Demo users (no backend needed)
  const DEMO_USERS = {
    "farmer@demo.com":   { _id: "demo_f1", name: "Ramesh Kumar",  email: "farmer@demo.com",   role: "farmer",   phone: "+91 98765 43210", address: "Nashik, Maharashtra" },
    "consumer@demo.com": { _id: "demo_c1", name: "Priya Sharma",  email: "consumer@demo.com", role: "consumer", phone: "+91 91234 56789", address: "Pune, Maharashtra" },
    "vendor@demo.com":   { _id: "demo_v1", name: "Suresh Vendor", email: "vendor@demo.com",   role: "vendor",   phone: "+91 99999 11111", address: "Mumbai, Maharashtra" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("Please fill all fields"); return; }
    setLoading(true);

    // Check demo users first (works without backend)
    const demoUser = DEMO_USERS[form.email.toLowerCase()];
    if (demoUser && form.password === "demo123") {
      setTimeout(() => {
        login(demoUser, "demo_token_" + demoUser.role);
        toast.success("Welcome back, " + demoUser.name + "! 👋");
        navigate(demoUser.role === "farmer" ? "/farmer/dashboard" : "/browse");
        setLoading(false);
      }, 800);
      return;
    }

    // Try real backend
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      toast.success(t("loginSuccess"));
      navigate(res.data.user.role === "farmer" ? "/farmer/dashboard" : "/browse");
    } catch (err) {
      toast.error("Invalid email or password. Try demo buttons above!");
    } finally {
      setLoading(false);
    }
  };

  // Demo login helper — directly logs in without needing to click submit
  const demoLogin = (role) => {
    const demos = {
      farmer:   { email: "farmer@demo.com",   password: "demo123" },
      consumer: { email: "consumer@demo.com", password: "demo123" },
    };
    const d = demos[role];
    setForm(d);
    setLoading(true);
    const demoUser = DEMO_USERS[d.email];
    setTimeout(() => {
      login(demoUser, "demo_token_" + demoUser.role);
      toast.success("Welcome, " + demoUser.name + "! 👋");
      navigate(demoUser.role === "farmer" ? "/farmer/dashboard" : "/browse");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="bg-primary-600 text-white p-2 rounded-xl group-hover:bg-primary-700 transition-colors">
              <FaLeaf className="text-xl" />
            </div>
            <span className="text-2xl font-bold text-primary-700">
              AGRI<span className="text-accent-500">ghar</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Welcome Back!</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="card p-8">
          {/* Demo buttons */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => demoLogin("farmer")}
              className="flex-1 text-xs bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium py-2 px-3 rounded-lg border border-primary-200 transition-colors">
              👨‍🌾 Demo Farmer
            </button>
            <button onClick={() => demoLogin("consumer")}
              className="flex-1 text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium py-2 px-3 rounded-lg border border-orange-200 transition-colors">
              🛒 Demo Consumer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("email")}</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("password")}</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : t("login")}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
              {t("register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
