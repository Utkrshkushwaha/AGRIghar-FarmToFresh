import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllFarmers, getProducts } from "../api/axios";
import ProductCard from "../components/ProductCard";
import StarRating from "../components/StarRating";
import { FaMapMarkerAlt, FaPhone, FaLeaf, FaBoxOpen } from "react-icons/fa";

const MOCK_FARMER = {
  _id: "f1", name: "Ramesh Kumar", address: "Nashik, Maharashtra",
  phone: "+91 98765 43210", avgRating: 4.5, productCount: 8,
  isOrganic: true, bio: "Organic vegetable farmer with 15 years of experience. I grow tomatoes, spinach, onions and seasonal vegetables using natural methods.",
  joinedDate: "2025-01-15",
};

const MOCK_PRODUCTS = [
  { _id: "1", name: "Fresh Tomatoes", category: "vegetables", price: 30, unit: "kg", isAvailable: true, farmerName: "Ramesh Kumar", avgRating: 4.5, reviewCount: 12 },
  { _id: "4", name: "Fresh Spinach",  category: "vegetables", price: 20, unit: "kg", isAvailable: true, farmerName: "Ramesh Kumar", avgRating: 4.2, reviewCount: 6, isOrganic: true },
  { _id: "7", name: "Onions",         category: "vegetables", price: 25, unit: "kg", isAvailable: true, farmerName: "Ramesh Kumar", avgRating: 4.0, reviewCount: 18 },
];

const FarmerProfile = () => {
  const { id } = useParams();
  const [farmer, setFarmer]     = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      getAllFarmers().catch(() => ({ data: [MOCK_FARMER] })),
      getProducts({ farmerId: id }).catch(() => ({ data: MOCK_PRODUCTS })),
    ]).then(([fRes, pRes]) => {
      const found = fRes.data.find((f) => f._id === id) || MOCK_FARMER;
      setFarmer(found);
      setProducts(pRes.data.products || pRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-40 bg-gray-200 rounded-2xl mb-6" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map((i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl" />)}
      </div>
    </div>
  );

  if (!farmer) return <div className="text-center py-20 text-gray-500">Farmer not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Farmer Header */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {farmer.name?.charAt(0)}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{farmer.name}</h1>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                  <FaMapMarkerAlt className="text-primary-500" />
                  <span>{farmer.address}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {farmer.isOrganic && (
                  <span className="flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    <FaLeaf /> Organic Farmer
                  </span>
                )}
              </div>
            </div>

            {/* Rating */}
            {farmer.avgRating > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <StarRating value={Math.round(farmer.avgRating)} readOnly size="text-base" />
                <span className="text-sm text-gray-600 font-medium">{farmer.avgRating?.toFixed(1)}</span>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <FaBoxOpen className="text-primary-500" />
                <span>{products.length} products</span>
              </div>
              {farmer.phone && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <FaPhone className="text-primary-500" />
                  <span>{farmer.phone}</span>
                </div>
              )}
              {farmer.joinedDate && (
                <div className="text-sm text-gray-500">
                  Member since {new Date(farmer.joinedDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </div>
              )}
            </div>

            {/* Bio */}
            {farmer.bio && (
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{farmer.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Products by {farmer.name}</h2>
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-5xl mb-3">🌱</div>
          <p>No products listed yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default FarmerProfile;
