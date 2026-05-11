import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  FaLeaf, FaShoppingCart, FaBars, FaTimes,
  FaUser, FaSignOutAlt, FaTachometerAlt, FaBoxOpen
} from "react-icons/fa";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`font-medium transition-colors duration-150 ${
        isActive(to)
          ? "text-primary-600 border-b-2 border-primary-500"
          : "text-gray-600 hover:text-primary-600"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg group-hover:bg-primary-700 transition-colors">
              <FaLeaf className="text-lg" />
            </div>
            <span className="text-xl font-bold text-primary-700">
              AGRI<span className="text-accent-500">ghar</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLink("/", t("home"))}
            {navLink("/browse", t("browse"))}
            {user?.role === "farmer" && navLink("/farmer/dashboard", t("farmerDashboard"))}
            {user && navLink("/orders", t("orders"))}
            <LanguageSwitcher />
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === "consumer" && (
                  <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                    <FaShoppingCart className="text-xl" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name?.split(" ")[0]}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link to="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <FaUser className="text-gray-400" /> Profile
                      </Link>
                      {user.role === "farmer" && (
                        <Link to="/farmer/dashboard" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <FaTachometerAlt className="text-gray-400" /> Dashboard
                        </Link>
                      )}
                      <Link to="/orders" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <FaBoxOpen className="text-gray-400" /> My Orders
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <FaSignOutAlt /> {t("logout")}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">{t("login")}</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">{t("register")}</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {navLink("/", t("home"))}
          {navLink("/browse", t("browse"))}
          {user?.role === "farmer" && navLink("/farmer/dashboard", t("farmerDashboard"))}
          {user && navLink("/orders", t("orders"))}
          <div className="pt-2 border-t border-gray-100">
            <LanguageSwitcher />
          </div>
          {user ? (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              {user.role === "consumer" && (
                <Link to="/cart" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaShoppingCart /> {t("cart")} {totalItems > 0 && `(${totalItems})`}
                </Link>
              )}
              <Link to="/profile" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-gray-700 font-medium">
                <FaUser /> Profile
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-medium">
                <FaSignOutAlt /> {t("logout")}
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1 text-center text-sm">{t("login")}</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center text-sm">{t("register")}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
