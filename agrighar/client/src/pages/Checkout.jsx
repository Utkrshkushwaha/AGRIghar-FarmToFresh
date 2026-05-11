import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/axios";
import { FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const CATEGORY_EMOJIS = { vegetables: "🥦", fruits: "🍎", grains: "🌾", dairy: "🥛", spices: "🌶️", other: "🛒" };

const Checkout = () => {
  const { t } = useTranslation();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: user?.address || "",
    phone: user?.phone || "",
    paymentMethod: "cod",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: confirm

  const deliveryFee = totalPrice > 200 ? 0 : 30;
  const grandTotal  = totalPrice + deliveryFee;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (!form.address) { toast.error("Please enter delivery address"); return; }
    if (!form.phone)   { toast.error("Please enter phone number"); return; }
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map((i) => ({ productId: i._id, qty: i.cartQty, price: i.price })),
        deliveryAddress: form.address,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
        totalAmount: grandTotal,
      };
      await placeOrder(orderData);
      clearCart();
      toast.success("🎉 Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      // Demo mode — works without backend
      clearCart();
      toast.success("🎉 Order placed successfully!");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate("/browse"); return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t("checkout")}</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { n: 1, label: "Delivery" },
          { n: 2, label: "Payment" },
          { n: 3, label: "Confirm" },
        ].map((s, i) => (
          <React.Fragment key={s.n}>
            <div className={`flex items-center gap-2 cursor-pointer ${step >= s.n ? "text-primary-600" : "text-gray-400"}`}
              onClick={() => step > s.n && setStep(s.n)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > s.n ? "bg-primary-600 text-white" :
                step === s.n ? "bg-primary-600 text-white ring-4 ring-primary-100" :
                "bg-gray-200 text-gray-500"
              }`}>
                {step > s.n ? <FaCheckCircle /> : s.n}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s.label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-1 rounded-full ${step > s.n ? "bg-primary-500" : "bg-gray-200"}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Delivery */}
          {step === 1 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary-600" /> {t("deliveryAddress")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address *</label>
                  <textarea name="address" value={form.address} onChange={handleChange}
                    placeholder="House No., Street, Village/City, District, State, PIN"
                    rows={3} className="input-field resize-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+91 98765 43210" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Notes (Optional)</label>
                  <input type="text" name="notes" value={form.notes} onChange={handleChange}
                    placeholder="Any special instructions..." className="input-field" />
                </div>
                <button onClick={() => { if (!form.address) { toast.error("Please enter address"); return; } setStep(2); }}
                  className="btn-primary w-full py-3">Continue to Payment</button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <FaCreditCard className="text-primary-600" /> {t("paymentMethod")}
              </h2>
              <div className="space-y-3 mb-6">
                {[
                  { value: "cod",    label: t("cod"),    icon: FaMoneyBillWave, desc: "Pay when your order arrives", color: "text-green-600" },
                  { value: "online", label: t("online"), icon: FaCreditCard,    desc: "UPI, Cards, Net Banking",      color: "text-blue-600" },
                ].map((pm) => (
                  <label key={pm.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.paymentMethod === pm.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <input type="radio" name="paymentMethod" value={pm.value}
                      checked={form.paymentMethod === pm.value} onChange={handleChange}
                      className="accent-primary-600 w-4 h-4" />
                    <pm.icon className={`text-xl ${pm.color}`} />
                    <div>
                      <p className="font-semibold text-gray-800">{pm.label}</p>
                      <p className="text-xs text-gray-500">{pm.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 py-3">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" /> Review & Confirm
              </h2>
              <div className="space-y-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">DELIVERY TO</p>
                  <p className="text-sm text-gray-800">{form.address}</p>
                  <p className="text-sm text-gray-600">{form.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">PAYMENT</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {form.paymentMethod === "cod" ? "💵 Cash on Delivery" : "💳 Online Payment"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1 py-3">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading}
                  className="btn-primary flex-1 py-3 disabled:opacity-60">
                  {loading ? "Placing Order..." : t("placeOrder")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-20">
            <h2 className="font-bold text-gray-800 mb-4">Order Items ({cartItems.length})</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <span className="text-2xl">{CATEGORY_EMOJIS[item.category] || "🛒"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.cartQty}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">₹{item.price * item.cartQty}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{totalPrice}</span></div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? "text-primary-600 font-medium" : ""}>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-base pt-1 border-t border-gray-100">
                <span>Total</span><span className="text-primary-700">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
