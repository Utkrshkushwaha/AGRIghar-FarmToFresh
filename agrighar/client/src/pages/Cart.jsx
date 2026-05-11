import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaShoppingCart, FaArrowRight, FaLeaf } from "react-icons/fa";

const CATEGORY_EMOJIS = { vegetables: "🥦", fruits: "🍎", grains: "🌾", dairy: "🥛", spices: "🌶️", other: "🛒" };

const Cart = () => {
  const { t } = useTranslation();
  const { cartItems, removeFromCart, updateQty, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Please Login</h2>
        <p className="text-gray-500 mb-6">You need to be logged in to view your cart.</p>
        <Link to="/login" className="btn-primary px-8 py-3">Login</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">{t("emptyCart")}</h2>
        <p className="text-gray-500 mb-6">Add some fresh produce from local farmers!</p>
        <Link to="/browse" className="btn-primary px-8 py-3">{t("continueShopping")}</Link>
      </div>
    );
  }

  const deliveryFee = totalPrice > 200 ? 0 : 30;
  const grandTotal  = totalPrice + deliveryFee;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaShoppingCart className="text-primary-600" /> {t("cart")}
          <span className="text-sm font-normal text-gray-500 ml-1">({cartItems.length} items)</span>
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
          <FaTrash className="text-xs" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div key={item._id} className="card p-4 flex items-center gap-4">
              {/* Image */}
              <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl">
                {CATEGORY_EMOJIS[item.category] || "🛒"}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.farmerName}</p>
                <p className="text-primary-700 font-bold mt-0.5">₹{item.price}/{item.unit}</p>
              </div>

              {/* Qty Controls */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => updateQty(item._id, item.cartQty - 1)}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm transition-colors">−</button>
                <span className="px-3 py-1.5 font-semibold text-gray-800 text-sm min-w-[2rem] text-center">{item.cartQty}</span>
                <button onClick={() => updateQty(item._id, item.cartQty + 1)}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm transition-colors">+</button>
              </div>

              {/* Subtotal */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-800">₹{item.price * item.cartQty}</p>
                <button onClick={() => removeFromCart(item._id)}
                  className="text-xs text-red-400 hover:text-red-600 mt-1 flex items-center gap-1 transition-colors">
                  <FaTrash className="text-xs" /> {t("removeFromCart")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-20">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? "text-primary-600 font-medium" : ""}>
                  {deliveryFee === 0 ? "FREE 🎉" : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-primary-600">Add ₹{200 - totalPrice} more for free delivery</p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-3 mb-5">
              <div className="flex justify-between font-bold text-gray-800 text-base">
                <span>{t("totalAmount")}</span>
                <span className="text-primary-700">₹{grandTotal}</span>
              </div>
            </div>

            <button onClick={() => navigate("/checkout")}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base">
              {t("checkout")} <FaArrowRight />
            </button>

            <Link to="/browse" className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-3 font-medium">
              {t("continueShopping")}
            </Link>

            {/* Trust badges */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
              <FaLeaf className="text-primary-400" />
              <span>Fresh & Direct from Farmers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
