import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ value = 0, onChange, readOnly = false, size = "text-xl" }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`transition-transform ${!readOnly ? "hover:scale-125 cursor-pointer" : "cursor-default"}`}
        >
          <FaStar
            className={`${size} transition-colors ${
              star <= (hovered || value) ? "text-yellow-400" : "text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
