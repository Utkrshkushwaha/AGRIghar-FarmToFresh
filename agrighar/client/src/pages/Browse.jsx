import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch, FaFilter, FaTimes, FaSortAmountDown } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/axios";

const CATEGORIES = ["all", "vegetables", "fruits", "grains", "dairy", "spices", "other"];
const SORT_OPTIONS = [
  { value: "newest",    label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc","label": "Price: High to Low" },
  { value: "rating",    label: "Top Rated" },
];

// Real product images from Unsplash (free, no API key)
const PRODUCT_IMAGES = {
  "1":  "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop",
  "2":  "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop",
  "3":  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
  "4":  "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
  "5":  "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
  "6":  "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=300&fit=crop",
  "7":  "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop",
  "8":  "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
  "9":  "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
  "10": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop",
  "11": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
  "12": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop",
};

const MOCK_PRODUCTS = [
  { _id: "1",  name: "Fresh Tomatoes",    category: "vegetables", price: 30,  unit: "kg",    isAvailable: true,  farmerName: "Ramesh Kumar",  avgRating: 4.5, reviewCount: 12, distance: 2.3 },
  { _id: "2",  name: "Alphonso Mangoes",  category: "fruits",     price: 120, unit: "dozen", isAvailable: true,  farmerName: "Suresh Patil",  avgRating: 5,   reviewCount: 8,  distance: 5.1, isOrganic: true },
  { _id: "3",  name: "Basmati Rice",      category: "grains",     price: 80,  unit: "kg",    isAvailable: true,  farmerName: "Mohan Singh",   avgRating: 4,   reviewCount: 20, distance: 8.7 },
  { _id: "4",  name: "Fresh Spinach",     category: "vegetables", price: 20,  unit: "kg",    isAvailable: true,  farmerName: "Priya Devi",    avgRating: 4.2, reviewCount: 6,  distance: 1.5, isOrganic: true },
  { _id: "5",  name: "Buffalo Milk",      category: "dairy",      price: 55,  unit: "liter", isAvailable: true,  farmerName: "Gopal Yadav",   avgRating: 4.8, reviewCount: 15, distance: 3.2 },
  { _id: "6",  name: "Red Chilli",        category: "spices",     price: 200, unit: "kg",    isAvailable: false, farmerName: "Anita Sharma",  avgRating: 4.3, reviewCount: 9,  distance: 6.4 },
  { _id: "7",  name: "Onions",            category: "vegetables", price: 25,  unit: "kg",    isAvailable: true,  farmerName: "Vijay Patil",   avgRating: 4.0, reviewCount: 18, distance: 4.2 },
  { _id: "8",  name: "Bananas",           category: "fruits",     price: 40,  unit: "dozen", isAvailable: true,  farmerName: "Lakshmi Devi",  avgRating: 4.6, reviewCount: 11, distance: 2.8 },
  { _id: "9",  name: "Wheat Flour",       category: "grains",     price: 45,  unit: "kg",    isAvailable: true,  farmerName: "Harish Kumar",  avgRating: 4.1, reviewCount: 7,  distance: 9.3 },
  { _id: "10", name: "Turmeric Powder",   category: "spices",     price: 180, unit: "kg",    isAvailable: true,  farmerName: "Meena Sharma",  avgRating: 4.7, reviewCount: 14, distance: 7.1, isOrganic: true },
  { _id: "11", name: "Paneer",            category: "dairy",      price: 280, unit: "kg",    isAvailable: true,  farmerName: "Gopal Yadav",   avgRating: 4.9, reviewCount: 22, distance: 3.2 },
  { _id: "12", name: "Potatoes",          category: "vegetables", price: 22,  unit: "kg",    isAvailable: true,  farmerName: "Ramesh Kumar",  avgRating: 3.8, reviewCount: 5,  distance: 2.3 },
];

const Browse = () => {
  const { t } = useTranslation();
  const [products, setProducts]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [category, setCategory]       = useState("all");
  const [sortBy, setSortBy]           = useState("newest");
  const [maxPrice, setMaxPrice]       = useState(500);
  const [showFilters, setShowFilters] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyOrganic, setOnlyOrganic]     = useState(false);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((res) => setProducts(res.data.products || res.data))
      .catch(() => setProducts(MOCK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...products];
    if (search)        result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.farmerName?.toLowerCase().includes(search.toLowerCase()));
    if (category !== "all") result = result.filter((p) => p.category === category);
    if (onlyAvailable) result = result.filter((p) => p.isAvailable);
    if (onlyOrganic)   result = result.filter((p) => p.isOrganic);
    result = result.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case "price_asc":  result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "rating":     result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0)); break;
      default: break;
    }
    setFiltered(result);
  }, [products, search, category, sortBy, maxPrice, onlyAvailable, onlyOrganic]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const clearFilters = () => {
    setSearch(""); setCategory("all"); setSortBy("newest");
    setMaxPrice(500); setOnlyAvailable(false); setOnlyOrganic(false);
  };

  const hasActiveFilters = search || category !== "all" || onlyAvailable || onlyOrganic || maxPrice < 500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("browse")}</h1>
        <p className="text-gray-500 text-sm mt-1">Fresh produce directly from local farmers</p>
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="input-field pl-10"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FaTimes />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto text-sm">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-primary-300"
            }`}>
            <FaFilter className="text-xs" /> {t("filter")}
            {hasActiveFilters && <span className="bg-white text-primary-600 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">!</span>}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-5 mb-6 border border-primary-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2"><FaFilter className="text-primary-500" /> Filters</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                <FaTimes /> Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">Max Price: ₹{maxPrice}</label>
              <input type="range" min="10" max="500" step="10" value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹10</span><span>₹500</span></div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-600">Options</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="accent-primary-600 w-4 h-4" />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={onlyOrganic} onChange={(e) => setOnlyOrganic(e.target.checked)}
                  className="accent-primary-600 w-4 h-4" />
                <span className="text-sm text-gray-700">Organic Only 🌿</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"
            }`}>
            {cat === "all" ? "🌿 All" :
             cat === "vegetables" ? "🥦 Vegetables" :
             cat === "fruits"     ? "🍎 Fruits" :
             cat === "grains"     ? "🌾 Grains" :
             cat === "dairy"      ? "🥛 Dairy" :
             cat === "spices"     ? "🌶️ Spices" : "🛒 Other"}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? "Loading..." : `${filtered.length} products found`}
        </p>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            Clear filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("noProducts")}</h3>
          <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Browse;
