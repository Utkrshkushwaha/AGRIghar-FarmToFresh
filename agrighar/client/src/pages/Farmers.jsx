import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getAllFarmers, getNearbyFarmers } from "../api/axios";
import FarmerCard from "../components/FarmerCard";
import { FaMapMarkerAlt, FaSearch, FaLocationArrow } from "react-icons/fa";
import toast from "react-hot-toast";

const MOCK_FARMERS = [
  { _id: "f1", name: "Ramesh Kumar",  address: "Nashik, Maharashtra",    avgRating: 4.5, productCount: 8,  distance: 2.3, isOrganic: true,  bio: "Organic vegetable farmer with 15 years of experience." },
  { _id: "f2", name: "Suresh Patil",  address: "Ratnagiri, Maharashtra", avgRating: 5,   productCount: 5,  distance: 5.1, isOrganic: true,  bio: "Specializes in Alphonso mangoes and tropical fruits." },
  { _id: "f3", name: "Mohan Singh",   address: "Amritsar, Punjab",       avgRating: 4,   productCount: 12, distance: 8.7, isOrganic: false, bio: "Wheat and rice farmer supplying premium grains." },
  { _id: "f4", name: "Priya Devi",    address: "Jaipur, Rajasthan",      avgRating: 4.2, productCount: 6,  distance: 1.5, isOrganic: true,  bio: "Grows leafy greens and seasonal vegetables." },
  { _id: "f5", name: "Gopal Yadav",   address: "Varanasi, UP",           avgRating: 4.8, productCount: 4,  distance: 3.2, isOrganic: false, bio: "Dairy farmer providing fresh milk and paneer." },
  { _id: "f6", name: "Anita Sharma",  address: "Guntur, Andhra Pradesh", avgRating: 4.3, productCount: 7,  distance: 6.4, isOrganic: true,  bio: "Spice farmer growing chilli, turmeric and coriander." },
  { _id: "f7", name: "Vijay Patil",   address: "Solapur, Maharashtra",   avgRating: 4.0, productCount: 9,  distance: 4.2, isOrganic: false, bio: "Onion and potato farmer." },
  { _id: "f8", name: "Lakshmi Devi",  address: "Coimbatore, Tamil Nadu", avgRating: 4.6, productCount: 6,  distance: 2.8, isOrganic: true,  bio: "Banana and coconut farmer." },
];

const Farmers = () => {
  const { t } = useTranslation();
  const [farmers, setFarmers]         = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [locating, setLocating]       = useState(false);
  const [onlyOrganic, setOnlyOrganic] = useState(false);

  useEffect(() => {
    getAllFarmers()
      .then((res) => setFarmers(res.data))
      .catch(() => setFarmers(MOCK_FARMERS))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...farmers];
    if (search) result = result.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.address?.toLowerCase().includes(search.toLowerCase())
    );
    if (onlyOrganic) result = result.filter((f) => f.isOrganic);
    setFiltered(result);
  }, [farmers, search, onlyOrganic]);

  const handleNearby = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await getNearbyFarmers(pos.coords.latitude, pos.coords.longitude);
          setFarmers(res.data);
          toast.success("Showing farmers near you!");
        } catch {
          toast.success("Showing nearby farmers (demo)");
          setFarmers([...MOCK_FARMERS].sort((a, b) => (a.distance || 0) - (b.distance || 0)));
        } finally {
          setLocating(false);
        }
      },
      () => { toast.error("Location access denied"); setLocating(false); }
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("nearbyFarmers")}</h1>
        <p className="text-gray-500 text-sm mt-1">Discover local farmers and buy directly from them</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farmers by name or location..."
            className="input-field pl-10" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2.5">
          <input type="checkbox" checked={onlyOrganic} onChange={(e) => setOnlyOrganic(e.target.checked)}
            className="accent-primary-600 w-4 h-4" />
          <span className="text-sm text-gray-700 font-medium">🌿 Organic Only</span>
        </label>
        <button onClick={handleNearby} disabled={locating}
          className="btn-primary flex items-center gap-2 px-5 disabled:opacity-60">
          <FaLocationArrow className={locating ? "animate-spin" : ""} />
          {locating ? "Locating..." : "Near Me"}
        </button>
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500 mb-4">
        {loading ? "Loading..." : `${filtered.length} farmers found`}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-14 h-14 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👨‍🌾</div>
          <h3 className="font-semibold text-gray-700 mb-2">No farmers found</h3>
          <p className="text-gray-500 text-sm">Try a different search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((f) => <FarmerCard key={f._id} farmer={f} />)}
        </div>
      )}

      {/* Location Info */}
      <div className="mt-8 bg-primary-50 border border-primary-200 rounded-2xl p-5 flex items-start gap-3">
        <FaMapMarkerAlt className="text-primary-600 text-xl flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-primary-800 text-sm">Find Farmers Near You</p>
          <p className="text-primary-700 text-xs mt-1">
            Click "Near Me" to discover farmers within your area. We use your location to show the closest farmers first.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Farmers;
