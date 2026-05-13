import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaStar, FaMapMarkerAlt, FaShoppingCart, FaLeaf } from "react-icons/fa";
import toast from "react-hot-toast";

const CATEGORY_COLORS = {
  vegetables: "bg-green-100 text-green-700",
  fruits:     "bg-orange-100 text-orange-700",
  grains:     "bg-yellow-100 text-yellow-700",
  dairy:      "bg-blue-100 text-blue-700",
  spices:     "bg-red-100 text-red-700",
  other:      "bg-gray-100 text-gray-700",
};

// Keyword to image mapping — matches product name to correct photo
const PRODUCT_IMAGE_MAP = [
  // Vegetables
  { keywords: ["tomato","tamatar"],  img: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop" },
  { keywords: ["spinach","palak"],   img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop" },
  { keywords: ["onion","pyaz","pyaaj","kanda"], img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop" },
  { keywords: ["potato","aloo","batata"], img: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&h=300&fit=crop" },
  { keywords: ["carrot","gajar"],    img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop" },
  { keywords: ["cabbage","patta"],   img: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=300&fit=crop" },
  { keywords: ["brinjal","eggplant","baingan","baigan"], img: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=300&fit=crop" },
  { keywords: ["cauliflower","gobi","phool"], img: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&h=300&fit=crop" },
  { keywords: ["cucumber","kheera","kakdi"], img: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop" },
  { keywords: ["pea","matar","vatana"], img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop" },
  { keywords: ["ladyfinger","bhindi","okra"], img: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400&h=300&fit=crop" },
  { keywords: ["capsicum","shimla","pepper"], img: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop" },
  { keywords: ["beetroot","beet","chukandar"], img: "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=400&h=300&fit=crop" },
  { keywords: ["radish","mooli"],    img: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400&h=300&fit=crop" },
  { keywords: ["pumpkin","kaddu"],   img: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=300&fit=crop" },
  // Fruits
  { keywords: ["mango","aam","alphonso","kesar","hapus"], img: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop" },
  { keywords: ["banana","kela"],     img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop" },
  { keywords: ["apple","seb"],       img: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=300&fit=crop" },
  { keywords: ["grape","angur","draksh"], img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=300&fit=crop" },
  { keywords: ["orange","santra","narangi"], img: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop" },
  { keywords: ["papaya","papita"],   img: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop" },
  { keywords: ["pomegranate","anar","dalimb"], img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop" },
  { keywords: ["watermelon","tarbooz","kalingad"], img: "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&h=300&fit=crop" },
  { keywords: ["pineapple","ananas"], img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop" },
  { keywords: ["guava","amrood","peru"], img: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&h=300&fit=crop" },
  { keywords: ["lemon","nimbu","lime"], img: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&h=300&fit=crop" },
  { keywords: ["strawberry","strawberries"], img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop" },
  { keywords: ["coconut","nariyal","narel"], img: "https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=400&h=300&fit=crop" },
  // Grains
  { keywords: ["rice","chawal","basmati"], img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop" },
  { keywords: ["wheat","gehu","flour","atta"], img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop" },
  { keywords: ["corn","maize","makka","bhutta"], img: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop" },
  { keywords: ["dal","lentil","pulse","masoor","moong","chana"], img: "https://images.unsplash.com/photo-1585996160832-5b8e0b4e8b8e?w=400&h=300&fit=crop" },
  { keywords: ["jowar","bajra","millet"], img: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=300&fit=crop" },
  // Dairy
  { keywords: ["milk","doodh","dudh"], img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop" },
  { keywords: ["paneer","cheese"],     img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop" },
  { keywords: ["ghee","butter","makhan"], img: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400&h=300&fit=crop" },
  { keywords: ["curd","yogurt","dahi","lassi"], img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop" },
  // Spices
  { keywords: ["turmeric","haldi"],    img: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop" },
  { keywords: ["chilli","chili","mirch","red chilli"], img: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=300&fit=crop" },
  { keywords: ["coriander","dhania","cilantro"], img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop" },
  { keywords: ["ginger","adrak"],      img: "https://images.unsplash.com/photo-1615485291234-9d694218aeb3?w=400&h=300&fit=crop" },
  { keywords: ["garlic","lahsun","lasun"], img: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&h=300&fit=crop" },
  { keywords: ["cumin","jeera"],       img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop" },
  { keywords: ["mustard","sarson","rai"], img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop" },
];

// Category fallback images
const CATEGORY_FALLBACK = {
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
  fruits:     "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop",
  grains:     "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=300&fit=crop",
  dairy:      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
  spices:     "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
  other:      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
};

// Smart image picker — exact match first, then partial match, then category fallback
const getProductImage = (product) => {
  if (product.image) return product.image;
  const nameLower = (product.name || "").toLowerCase().trim();

  // Try exact match first
  const exactMatch = PRODUCT_IMAGE_MAP.find((m) =>
    m.keywords.some((kw) => nameLower === kw.toLowerCase())
  );
  if (exactMatch) return exactMatch.img;

  // Try partial match
  const partialMatch = PRODUCT_IMAGE_MAP.find((m) =>
    m.keywords.some((kw) => nameLower.includes(kw.toLowerCase()))
  );
  if (partialMatch) return partialMatch.img;

  // Category fallback
  return CATEGORY_FALLBACK[product.category] || CATEGORY_FALLBACK.other;
};

// Emoji fallback if image fails to load
const CATEGORY_EMOJIS = {
  vegetables: "🥦", fruits: "🍎", grains: "🌾",
  dairy: "🥛", spices: "🌶️", other: "🛒",
};

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to add items to cart"); return; }
    if (user.role === "farmer") { toast.error("Farmers cannot buy products"); return; }
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const avgRating = product.avgRating || 0;
  const imgSrc = getProductImage(product);

  return (
    <Link to={`/product/${product._id}`} className="card block group overflow-hidden">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <span
          className="text-6xl group-hover:scale-110 transition-transform duration-300"
          style={{ display: imgSrc ? "none" : "flex" }}
        >
          {CATEGORY_EMOJIS[product.category] || "🛒"}
        </span>
        <div className="absolute top-2 left-2">
          <span className={`badge ${CATEGORY_COLORS[product.category] || "bg-gray-100 text-gray-700"}`}>
            {t(product.category)}
          </span>
        </div>
        {product.isOrganic && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <FaLeaf className="text-xs" /> Organic
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 font-semibold px-3 py-1 rounded-full text-sm">
              {t("outOfStock")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-base mb-1 truncate group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Farmer info */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <FaMapMarkerAlt className="text-primary-400" />
          <span className="truncate">{product.farmerName || "Local Farmer"}</span>
          {product.distance && <span className="ml-auto text-primary-600 font-medium">{product.distance} km</span>}
        </div>

        {/* Rating */}
        {avgRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map((s) => (
              <FaStar key={s} className={`text-xs ${s <= Math.round(avgRating) ? "text-yellow-400" : "text-gray-200"}`} />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
          </div>
        )}

        {/* Price & Cart */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-primary-700">₹{product.price}</span>
            <span className="text-xs text-gray-500 ml-1">/{t(product.unit) || product.unit}</span>
          </div>
          {product.isAvailable && (
            <button
              onClick={handleAddToCart}
              className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors shadow-sm"
              title={t("addToCart")}
            >
              <FaShoppingCart className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
