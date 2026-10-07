import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import PaymentModal from "./PaymentModal";
import {
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
  User,
  Phone,
  CreditCard,
  Building
} from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart, estimatedPrepMinutes } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form details prefilled from logged-in user profile
  const [formData, setFormData] = useState({
    name: user?.name || "Rahul Sharma",
    student_id: user?.student_id || "CS-2023-042",
    phone: user?.phone || "+91 98765 43210",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (cartItems.length === 0 && !createdOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500">
          Please add food items from the menu before proceeding to checkout.
        </p>
        <Link
          to="/menu"
          className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-xs"
        >
          Explore Today's Menu
        </Link>
      </div>
    );
  }

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.student_id.trim() || !formData.phone.trim()) {
      setError("Please fill in all student details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map((c) => ({
          food_item_id: c.item.id,
          quantity: c.quantity,
        })),
        student_name: formData.name,
        student_id: formData.student_id,
        phone: formData.phone,
        payment_method: "UPI",
      };

      const orderRes = await api.createOrder(orderPayload);
      setCreatedOrder(orderRes);
      // Open realistic payment gateway modal
      setIsPaymentOpen(true);
    } catch (err) {
      setError(err.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (verifyRes) => {
    // Clear cart on verified payment
    clearCart();
    setIsPaymentOpen(false);
    // Navigate straight to the live order tracker
    navigate(`/track/${verifyRes.order_id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Checkout & Pickup Details
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your student credentials and food tray before making payment.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Student Details Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleCreateOrder} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-sm text-slate-900">
                Student Identification
              </h2>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    College ID / Student ID
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="e.g. CS-2023-042"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Crucial Pickup Notice from Prompt Requirement 8 */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-950">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pickup Information</span>
              </div>
              <p className="leading-relaxed text-emerald-800">
                “Your order will be prepared at ChatSpot Canteen. Please come to the pickup counter only after your order is marked <strong>READY</strong>.”
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Pay ₹{subtotal}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-slate-500">{cartItems.length} items</span>
            </h3>

            {/* Items list */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {cartItems.map(({ item, quantity }) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-slate-400 font-medium">× {quantity}</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ₹{item.price * quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Prep time info */}
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs flex items-center gap-2 text-amber-900">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Estimated prep time: <strong>{estimatedPrepMinutes}–{estimatedPrepMinutes + 5} mins</strong>
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Campus Platform Fee</span>
                <span className="font-semibold text-emerald-600">FREE (₹0)</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-emerald-600 text-base">₹{subtotal}</span>
              </div>
            </div>

          </div>

          <div className="p-3 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted payment with mock simulation mode enabled</span>
          </div>
        </div>

      </div>

      {/* Realistic Multi-State Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        order={createdOrder}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
