import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaLeaf, FaTruck, FaShieldAlt, FaUsers, FaArrowRight, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import FarmerCard from "../components/FarmerCard";
import { getProducts, getAllFarmers } from "../api/axios";

// Mock data for demo (used when backend is not connected)
const MOCK_PRODUCTS = [
  { _id: "1", name: "Fresh Tomatoes",   category: "vegetables", price: 30,  unit: "kg",    isAvailable: true,  farmerName: "Ramesh Kumar",  avgRating: 4.5, reviewCount: 12, distance: 2.3 },
  { _id: "2", name: "Alphonso Mangoes", category: "fruits",     price: 120, unit: "dozen", isAvailable: true,  farmerName: "Suresh Patil",  avgRating: 5,   reviewCount: 8,  distance: 5.1, isOrganic: true },
  { _id: "3", name: "Basmati Rice",     category: "grains",     price: 80,  unit: "kg",    isAvailable: true,  farmerName: "Mohan Singh",   avgRating: 4,   reviewCount: 20, distance: 8.7 },
  { _id: "4", name: "Fresh Spinach",    category: "vegetables", price: 20,  unit: "kg",    isAvailable: true,  farmerName: "Priya Devi",    avgRating: 4.2, reviewCount: 6,  distance: 1.5, isOrganic: true },
  { _id: "5", name: "Buffalo Milk",     category: "dairy",      price: 55,  unit: "liter", isAvailable: true,  farmerName: "Gopal Yadav",   avgRating: 4.8, reviewCount: 15, distance: 3.2 },
  { _id: "6", name: "Red Chilli",       category: "spices",     price: 200, unit: "kg",    isAvailable: false, farmerName: "Anita Sharma",  avgRating: 4.3, reviewCount: 9,  distance: 6.4 },
];

const MOCK_FARMERS = [
  { _id: "f1", name: "Ramesh Kumar",  address: "Nashik, Maharashtra", avgRating: 4.5, productCount: 8,  distance: 2.3, isOrganic: true,  bio: "Organic vegetable farmer with 15 years of experience." },
  { _id: "f2", name: "Suresh Patil",  address: "Ratnagiri, Maharashtra", avgRating: 5,   productCount: 5,  distance: 5.1, isOrganic: true,  bio: "Specializes in Alphonso mangoes and tropical fruits." },
  { _id: "f3", name: "Mohan Singh",   address: "Amritsar, Punjab",    avgRating: 4,   productCount: 12, distance: 8.7, isOrganic: false, bio: "Wheat and rice farmer supplying premium grains." },
  { _id: "f4", name: "Priya Devi",    address: "Jaipur, Rajasthan",   avgRating: 4.2, productCount: 6,  distance: 1.5, isOrganic: true,  bio: "Grows leafy greens and seasonal vegetables." },
];

const STATS = [
  { label: "Farmers",   value: "2,400+", icon: "👨‍🌾" },
  { label: "Products",  value: "8,000+", icon: "🥦" },
  { label: "Consumers", value: "15,000+",icon: "🏠" },
  { label: "Districts", value: "120+",   icon: "📍" },
];

const FEATURES = [
  { icon: FaLeaf,      title: "Direct from Farm",    desc: "No middlemen. Buy directly from the farmer who grew your food.",       color: "bg-green-50 text-green-600" },
  { icon: FaShieldAlt, title: "Transparent Pricing", desc: "See real farm prices. Know exactly what you pay and why.",             color: "bg-blue-50 text-blue-600" },
  { icon: FaTruck,     title: "Fast Delivery",        desc: "Efficient delivery coordination with real-time order tracking.",       color: "bg-orange-50 text-orange-600" },
  { icon: FaUsers,     title: "Community Trust",      desc: "Verified farmers, ratings & reviews to ensure quality every time.",   color: "bg-purple-50 text-purple-600" },
];

const Home = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [farmers, setFarmers]   = useState(MOCK_FARMERS);

  useEffect(() => {
    getProducts({ limit: 6 })
      .then((res) => setProducts(res.data.products || res.data))
      .catch(() => setProducts(MOCK_PRODUCTS));

    getAllFarmers()
      .then((res) => setFarmers(res.data.slice(0, 4)))
      .catch(() => setFarmers(MOCK_FARMERS));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🌾</div>
          <div className="absolute top-20 right-20 text-8xl">🥦</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">🍎</div>
          <div className="absolute bottom-20 right-10 text-8xl">🌽</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <FaLeaf className="text-primary-200" />
              BGI Hackathon 2026 — Team Green Coders
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              {t("welcome")}
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
              {t("subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/browse" className="bg-white text-primary-700 hover:bg-primary-50 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                {t("shopNow")} <FaArrowRight />
              </Link>
              <Link to="/register" className="bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                {t("sellNow")} <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="card p-5 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-primary-700">{stat.value}</div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
          Why Choose <span className="text-primary-600">AGRIghar</span>?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 text-center hover:border-primary-200 border border-transparent transition-all">
              <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <f.icon className="text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t("featuredProducts")}</h2>
          <Link to="/browse" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
            View All <FaArrowRight className="text-xs" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* Nearby Farmers */}
      <section className="bg-primary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{t("nearbyFarmers")}</h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <FaMapMarkerAlt className="text-primary-500" /> Farmers near your location
              </p>
            </div>
            <Link to="/farmers" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {farmers.map((f) => <FarmerCard key={f._id} farmer={f} />)}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Are you a Farmer?</h2>
          <p className="text-primary-100 mb-6 max-w-xl mx-auto">
            Join AGRIghar and sell your produce directly to consumers. Get fair prices, no commission, no middlemen.
          </p>
          <Link to="/register" className="bg-white text-primary-700 hover:bg-primary-50 font-bold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2">
            Register as Farmer <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Ramesh Kumar", role: "Farmer, Maharashtra", text: "AGRIghar helped me sell my tomatoes at ₹30/kg instead of ₹12 at the mandi. My income doubled!", avatar: "R" },
              { name: "Priya Sharma", role: "Consumer, Pune",      text: "I get fresh vegetables delivered from local farmers. The quality is amazing and prices are fair!", avatar: "P" },
              { name: "Suresh Patil", role: "Farmer, Nashik",      text: "The platform is easy to use even in Hindi. I listed my mangoes and got orders within hours!", avatar: "S" },
            ].map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => <FaStar key={s} className="text-yellow-400 text-sm" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
