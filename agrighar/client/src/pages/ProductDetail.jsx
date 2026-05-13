import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProductById, getReviews, submitReview } from "../api/axios";
import StarRating from "../components/StarRating";
import { FaMapMarkerAlt, FaLeaf, FaShoppingCart, FaBolt, FaArrowLeft, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

// Full mock product database — matches Browse page
const MOCK_PRODUCTS = {
  "1":  { _id: "1",  name: "Fresh Tomatoes",   category: "vegetables", price: 30,  unit: "kg",    isAvailable: true,  farmerName: "Ramesh Kumar",  farmerId: "f1", avgRating: 4.5, reviewCount: 12, distance: 2.3, isOrganic: true,  quantity: 50, description: "Fresh, juicy tomatoes grown without pesticides. Harvested daily from our organic farm in Nashik. Rich in vitamins and perfect for cooking." },
  "2":  { _id: "2",  name: "Alphonso Mangoes", category: "fruits",     price: 120, unit: "dozen", isAvailable: true,  farmerName: "Suresh Patil",  farmerId: "f2", avgRating: 5,   reviewCount: 8,  distance: 5.1, isOrganic: true,  quantity: 30, description: "Premium Alphonso mangoes from Ratnagiri. Known for their rich aroma, golden colour and sweet taste. Directly from the orchard." },
  "3":  { _id: "3",  name: "Basmati Rice",     category: "grains",     price: 80,  unit: "kg",    isAvailable: true,  farmerName: "Mohan Singh",   farmerId: "f3", avgRating: 4,   reviewCount: 20, distance: 8.7, isOrganic: false, quantity: 200, description: "Long grain Basmati rice from Punjab. Aged for 2 years for perfect aroma and taste. Ideal for biryani and pulao." },
  "4":  { _id: "4",  name: "Fresh Spinach",    category: "vegetables", price: 20,  unit: "kg",    isAvailable: true,  farmerName: "Priya Devi",    farmerId: "f4", avgRating: 4.2, reviewCount: 6,  distance: 1.5, isOrganic: true,  quantity: 40, description: "Tender organic spinach leaves, freshly harvested. Rich in iron and vitamins. Perfect for salads, curries and smoothies." },
  "5":  { _id: "5",  name: "Buffalo Milk",     category: "dairy",      price: 55,  unit: "liter", isAvailable: true,  farmerName: "Gopal Yadav",   farmerId: "f5", avgRating: 4.8, reviewCount: 15, distance: 3.2, isOrganic: false, quantity: 100, description: "Fresh buffalo milk collected every morning. High fat content, perfect for making paneer, ghee and sweets." },
  "6":  { _id: "6",  name: "Red Chilli",       category: "spices",     price: 200, unit: "kg",    isAvailable: false, farmerName: "Anita Sharma",  farmerId: "f6", avgRating: 4.3, reviewCount: 9,  distance: 6.4, isOrganic: true,  quantity: 0,  description: "Sun-dried red chillies from Guntur. Medium to high heat level. Adds vibrant colour and spice to any dish." },
  "7":  { _id: "7",  name: "Onions",           category: "vegetables", price: 25,  unit: "kg",    isAvailable: true,  farmerName: "Vijay Patil",   farmerId: "f7", avgRating: 4.0, reviewCount: 18, distance: 4.2, isOrganic: false, quantity: 150, description: "Fresh red onions from Solapur. Crisp, pungent and perfect for everyday cooking. Stored in cool dry conditions." },
  "8":  { _id: "8",  name: "Bananas",          category: "fruits",     price: 40,  unit: "dozen", isAvailable: true,  farmerName: "Lakshmi Devi",  farmerId: "f8", avgRating: 4.6, reviewCount: 11, distance: 2.8, isOrganic: true,  quantity: 80, description: "Sweet and ripe Robusta bananas from Tamil Nadu. Rich in potassium and natural energy. Freshly harvested." },
  "9":  { _id: "9",  name: "Wheat Flour",      category: "grains",     price: 45,  unit: "kg",    isAvailable: true,  farmerName: "Harish Kumar",  farmerId: "f3", avgRating: 4.1, reviewCount: 7,  distance: 9.3, isOrganic: false, quantity: 300, description: "Stone-ground whole wheat flour. Made from premium wheat. Ideal for rotis, chapatis and bread." },
  "10": { _id: "10", name: "Turmeric Powder",  category: "spices",     price: 180, unit: "kg",    isAvailable: true,  farmerName: "Meena Sharma",  farmerId: "f6", avgRating: 4.7, reviewCount: 14, distance: 7.1, isOrganic: true,  quantity: 60, description: "Pure organic turmeric powder from Erode. High curcumin content. Anti-inflammatory and great for cooking and health." },
  "11": { _id: "11", name: "Paneer",           category: "dairy",      price: 280, unit: "kg",    isAvailable: true,  farmerName: "Gopal Yadav",   farmerId: "f5", avgRating: 4.9, reviewCount: 22, distance: 3.2, isOrganic: false, quantity: 25, description: "Fresh homemade paneer from pure buffalo milk. Soft, creamy texture. Made fresh daily without preservatives." },
  "12": { _id: "12", name: "Potatoes",         category: "vegetables", price: 22,  unit: "kg",    isAvailable: true,  farmerName: "Ramesh Kumar",  farmerId: "f1", avgRating: 3.8, reviewCount: 5,  distance: 2.3, isOrganic: false, quantity: 200, description: "Fresh potatoes from Nashik farms. Ideal for curries, fries and snacks. Freshly dug from the field." },
};

// Keyword to image mapping — matches product name to correct photo
const PRODUCT_IMAGE_MAP = [
  { keywords: ["tomato","tamatar"],  img: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&h=400&fit=crop" },
  { keywords: ["spinach","palak"],   img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop" },
  { keywords: ["onion","pyaz","kanda"], img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=400&fit=crop" },
  { keywords: ["potato","aloo","batata"], img: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&h=400&fit=crop" },
  { keywords: ["carrot","gajar"],    img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=400&fit=crop" },
  { keywords: ["cauliflower","gobi"], img: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&h=400&fit=crop" },
  { keywords: ["cucumber","kheera"], img: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&h=400&fit=crop" },
  { keywords: ["brinjal","eggplant","baingan"], img: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=600&h=400&fit=crop" },
  { keywords: ["capsicum","shimla","pepper"], img: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&h=400&fit=crop" },
  { keywords: ["ladyfinger","bhindi","okra"], img: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=600&h=400&fit=crop" },
  { keywords: ["pumpkin","kaddu"],   img: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=600&h=400&fit=crop" },
  { keywords: ["mango","aam","alphonso","kesar","hapus"], img: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=400&fit=crop" },
  { keywords: ["banana","kela"],     img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=400&fit=crop" },
  { keywords: ["apple","seb"],       img: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600&h=400&fit=crop" },
  { keywords: ["grape","angur"],     img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&h=400&fit=crop" },
  { keywords: ["orange","santra"],   img: "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&h=400&fit=crop" },
  { keywords: ["pineapple","ananas"], img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=400&fit=crop" },
  { keywords: ["watermelon","tarbooz"], img: "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600&h=400&fit=crop" },
  { keywords: ["papaya","papita"],   img: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&h=400&fit=crop" },
  { keywords: ["guava","amrood"],    img: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=600&h=400&fit=crop" },
  { keywords: ["lemon","nimbu"],     img: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600&h=400&fit=crop" },
  { keywords: ["coconut","nariyal"], img: "https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=600&h=400&fit=crop" },
  { keywords: ["rice","chawal","basmati"], img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop" },
  { keywords: ["wheat","flour","atta","gehu"], img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop" },
  { keywords: ["corn","maize","makka"], img: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=400&fit=crop" },
  { keywords: ["dal","lentil","pulse","moong","chana"], img: "https://images.unsplash.com/photo-1585996160832-5b8e0b4e8b8e?w=600&h=400&fit=crop" },
  { keywords: ["milk","doodh"],      img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=400&fit=crop" },
  { keywords: ["paneer","cheese"],   img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop" },
  { keywords: ["ghee","butter"],     img: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=600&h=400&fit=crop" },
  { keywords: ["curd","dahi","yogurt"], img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop" },
  { keywords: ["turmeric","haldi"],  img: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=400&fit=crop" },
  { keywords: ["chilli","chili","mirch"], img: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&h=400&fit=crop" },
  { keywords: ["ginger","adrak"],    img: "https://images.unsplash.com/photo-1615485291234-9d694218aeb3?w=600&h=400&fit=crop" },
  { keywords: ["garlic","lahsun"],   img: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600&h=400&fit=crop" },
  { keywords: ["coriander","dhania"], img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop" },
];

const CATEGORY_FALLBACK = {
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop",
  fruits:     "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&h=400&fit=crop",
  grains:     "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&h=400&fit=crop",
  dairy:      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=400&fit=crop",
  spices:     "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop",
  other:      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
};

const getProductImage = (product) => {
  if (product.image) return product.image;
  const nameLower = (product.name || "").toLowerCase().trim();

  // Exact match first
  const exactMatch = PRODUCT_IMAGE_MAP.find((m) =>
    m.keywords.some((kw) => nameLower === kw.toLowerCase())
  );
  if (exactMatch) return exactMatch.img;

  // Partial match
  const partialMatch = PRODUCT_IMAGE_MAP.find((m) =>
    m.keywords.some((kw) => nameLower.includes(kw.toLowerCase()))
  );
  if (partialMatch) return partialMatch.img;

  return CATEGORY_FALLBACK[product.category] || CATEGORY_FALLBACK.other;
};

const MOCK_REVIEWS = [
  { _id: "r1", userName: "Priya S.", rating: 5, comment: "Very fresh tomatoes! Delivered on time.", createdAt: "2026-04-10" },
  { _id: "r2", userName: "Amit K.", rating: 4, comment: "Good quality, will order again.", createdAt: "2026-04-08" },
  { _id: "r3", userName: "Sunita R.", rating: 5, comment: "Organic and tasty. Best tomatoes I've had!", createdAt: "2026-04-05" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct]   = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [qty, setQty]           = useState(1);
  const [loading, setLoading]   = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProductById(id).catch(() => ({ data: MOCK_PRODUCTS[id] || MOCK_PRODUCTS["1"] })),
      getReviews(id).catch(() => ({ data: MOCK_REVIEWS })),
    ]).then(([pRes, rRes]) => {
      setProduct(pRes.data);
      setReviews(rRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) { toast.error("Please login first"); navigate("/login"); return; }
    if (user.role === "farmer") { toast.error("Farmers cannot buy products"); return; }
    addToCart(product, qty);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to review"); return; }
    if (!myRating) { toast.error("Please select a rating"); return; }
    setSubmitting(true);
    try {
      await submitReview({ productId: id, rating: myRating, comment: myComment });
      toast.success("Review submitted!");
      setMyRating(0); setMyComment("");
      const rRes = await getReviews(id);
      setReviews(rRes.data);
    } catch {
      // Demo: add locally
      setReviews([{ _id: Date.now(), userName: user.name, rating: myRating, comment: myComment, createdAt: new Date().toISOString().split("T")[0] }, ...reviews]);
      toast.success("Review submitted!");
      setMyRating(0); setMyComment("");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-80 bg-gray-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-12 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const CATEGORY_EMOJIS = { vegetables: "🥦", fruits: "🍎", grains: "🌾", dairy: "🥛", spices: "🌶️", other: "🛒" };
  const imgSrc = getProductImage(product);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <FaArrowLeft /> Back to Browse
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Image */}
        <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl h-80 flex items-center justify-center overflow-hidden">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <span
            className="text-9xl items-center justify-center"
            style={{ display: imgSrc ? "none" : "flex" }}
          >
            {CATEGORY_EMOJIS[product.category] || "🛒"}
          </span>
          {product.isOrganic && (
            <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
              <FaLeaf /> Organic
            </div>
          )}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
              <span className="bg-white text-gray-700 font-bold px-6 py-2 rounded-full">{t("outOfStock")}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <span className="badge bg-primary-100 text-primary-700 capitalize">{t(product.category)}</span>
          </div>

          {/* Farmer */}
          <Link to={`/farmer/${product.farmerId}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-3 transition-colors">
            <div className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {product.farmerName?.charAt(0)}
            </div>
            {product.farmerName}
            {product.distance && (
              <span className="flex items-center gap-1 text-primary-600 font-medium ml-2">
                <FaMapMarkerAlt className="text-xs" /> {product.distance} km
              </span>
            )}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <StarRating value={Math.round(product.avgRating || 0)} readOnly size="text-base" />
            <span className="text-sm text-gray-500">({product.reviewCount || reviews.length} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-extrabold text-primary-700">₹{product.price}</span>
            <span className="text-gray-500">per {t(product.unit) || product.unit}</span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.description}</p>
          )}

          {/* Quantity */}
          {product.isAvailable && (
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm font-medium text-gray-700">{t("quantity")}:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors">−</button>
                <span className="px-4 py-2 font-semibold text-gray-800 min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors">+</button>
              </div>
              <span className="text-sm text-gray-500">Total: <strong className="text-primary-700">₹{product.price * qty}</strong></span>
            </div>
          )}

          {/* Action Buttons */}
          {product.isAvailable ? (
            <div className="flex gap-3">
              <button onClick={handleAddToCart}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3">
                <FaShoppingCart /> {t("addToCart")}
              </button>
              <button onClick={handleBuyNow}
                className="btn-accent flex-1 flex items-center justify-center gap-2 py-3">
                <FaBolt /> {t("buyNow")}
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 text-gray-500 text-center py-3 rounded-lg font-medium">{t("outOfStock")}</div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-100 pt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{t("reviews")} ({reviews.length})</h2>

        {/* Write Review */}
        {user && user.role !== "farmer" && (
          <div className="card p-5 mb-6 border border-primary-100">
            <h3 className="font-semibold text-gray-700 mb-3">{t("review")}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Your Rating</label>
                <StarRating value={myRating} onChange={setMyRating} size="text-2xl" />
              </div>
              <textarea value={myComment} onChange={(e) => setMyComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={3} className="input-field resize-none" />
              <button type="submit" disabled={submitting} className="btn-primary px-6 py-2 text-sm">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {/* Review List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {r.userName?.charAt(0) || <FaUser />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800 text-sm">{r.userName}</span>
                      <span className="text-xs text-gray-400">{r.createdAt}</span>
                    </div>
                    <StarRating value={r.rating} readOnly size="text-sm" />
                    {r.comment && <p className="text-sm text-gray-600 mt-1.5">{r.comment}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
