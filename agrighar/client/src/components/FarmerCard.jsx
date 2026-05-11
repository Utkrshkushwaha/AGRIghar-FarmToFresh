import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaLeaf, FaBoxOpen } from "react-icons/fa";

const FarmerCard = ({ farmer }) => {
  return (
    <Link to={`/farmer/${farmer._id}`} className="card block p-4 hover:border-primary-200 border border-transparent transition-all group">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
          {farmer.name?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors truncate">
            {farmer.name}
          </h3>

          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <FaMapMarkerAlt className="text-primary-400 flex-shrink-0" />
            <span className="truncate">{farmer.address || "Local Area"}</span>
          </div>

          {farmer.distance !== undefined && (
            <span className="text-xs text-primary-600 font-medium">{farmer.distance} km away</span>
          )}

          <div className="flex items-center gap-3 mt-2">
            {farmer.avgRating > 0 && (
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400 text-xs" />
                <span className="text-xs font-medium text-gray-700">{farmer.avgRating?.toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FaBoxOpen className="text-primary-400" />
              <span>{farmer.productCount || 0} products</span>
            </div>
            {farmer.isOrganic && (
              <span className="flex items-center gap-1 text-xs text-primary-600 font-medium">
                <FaLeaf /> Organic
              </span>
            )}
          </div>
        </div>
      </div>

      {farmer.bio && (
        <p className="text-xs text-gray-500 mt-3 line-clamp-2">{farmer.bio}</p>
      )}
    </Link>
  );
};

export default FarmerCard;
