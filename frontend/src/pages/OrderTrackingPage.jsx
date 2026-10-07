import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import {
  CheckCircle2,
  Clock,
  Phone,
  ArrowLeft,
  Sparkles,
  ChefHat,
  ShoppingBag,
  Bell,
  RefreshCw,
  Search,
  MapPin,
  ExternalLink
} from "lucide-react";

export default function OrderTrackingPage() {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(routeId || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchOrder = async (queryId) => {
    if (!queryId) {
      setLoading(false);
      return;
    }
    setError("");
    try {
      const data = await api.trackOrder(queryId);
      setOrder(data);
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err.message || "Order not found");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeId) {
      fetchOrder(routeId);
    } else {
      // Default to demo order A127 / CS1024 if no ID in URL
      fetchOrder("CS1024");
    }

    // Auto refresh every 5 seconds for live status updates
    const interval = setInterval(() => {
      if (routeId || order?.order_number) {
        fetchOrder(routeId || order?.order_number);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [routeId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${searchInput.trim().toUpperCase()}`);
    }
  };

  const steps = [
    { key: "PLACED", label: "Order Placed" },
    { key: "PAYMENT_CONFIRMED", label: "Payment Confirmed" },
    { key: "NEW", label: "Order Received" },
    { key: "PREPARING", label: "Preparing Your Food" },
    { key: "READY", label: "Ready for Pickup" },
    { key: "COMPLETED", label: "Completed" },
  ];

  const getStepStatus = (stepKey, currentStatus) => {
    const orderHierarchy = {
      NEW: 2,
      ACCEPTED: 2,
      PREPARING: 3,
      READY: 4,
      COMPLETED: 5,
    };

    const currentRank = orderHierarchy[currentStatus] ?? 2;

    if (stepKey === "PLACED" || stepKey === "PAYMENT_CONFIRMED") return "completed";
    if (stepKey === "NEW") return currentRank >= 2 ? "completed" : "pending";
    if (stepKey === "PREPARING") {
      if (currentRank > 3) return "completed";
      if (currentRank === 3) return "current";
      return "pending";
    }
    if (stepKey === "READY") {
      if (currentRank > 4) return "completed";
      if (currentRank === 4) return "current";
      return "pending";
    }
    if (stepKey === "COMPLETED") {
      return currentRank === 5 ? "completed" : "pending";
    }
    return "pending";
  };

  const isReady = order?.status === "READY";
  const isCompleted = order?.status === "COMPLETED";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search Tracker Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Live Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time status synced with ChatSpot Canteen kitchen
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Token (e.g. A127) or Order ID"
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-campus-navy text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Track
          </button>
        </form>
      </div>

      {loading ? (
        <div className="h-96 bg-slate-200 animate-pulse rounded-3xl" />
      ) : error ? (
        <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Order Not Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {error}. Try tracking token <strong>A127</strong>, <strong>A126</strong>, or <strong>A125</strong>.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSearchInput("A127");
                fetchOrder("A127");
              }}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              Track Demo Order (Token A127)
            </button>
          </div>
        </div>
      ) : order ? (
        <div className="space-y-6">
          
          {/* WHEN READY: Prominent Celebration Banner */}
          {isReady && (
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                    Counter Alert
                  </span>
                  <h2 className="text-2xl font-black tracking-tight">
                    🎉 Your Order is Ready!
                  </h2>
                </div>
              </div>

              <p className="text-sm text-emerald-100 font-medium">
                “Please collect your order from the ChatSpot pickup counter at <strong>{order.pickup_counter || "Counter 1"}</strong>.”
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/20">
                <div className="text-center sm:text-left flex-1">
                  <span className="text-xs text-emerald-200 uppercase font-semibold">
                    Show This Token at Counter
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    TOKEN {order.token_number}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href="tel:+919845011223"
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-white text-emerald-900 font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-50 transition flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Canteen</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* MAIN ORDER CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-8">
            
            {/* Top Bar with Order & Token High Visibility Display */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Order Reference
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className="text-2xl font-black text-slate-900">
                    Order #{order.order_number}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    isReady
                      ? "bg-emerald-100 text-emerald-800"
                      : isCompleted
                      ? "bg-slate-100 text-slate-700"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Ordered for: <strong className="text-slate-800">{order.student_name}</strong> ({order.student_id_val})
                </p>
              </div>

              {/* Massive Visible Token Box */}
              <div className="p-4 bg-campus-navy text-white rounded-2xl text-center sm:text-right shadow-sm border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                  Pickup Token
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white my-0.5">
                  {order.token_number}
                </div>
                <span className="text-[11px] text-slate-300 font-medium">
                  {order.pickup_counter || "Counter 1"}
                </span>
              </div>
            </div>

            {/* STATUS TIMELINE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Kitchen Timeline
                </h4>
                {order.estimated_ready_time && !isCompleted && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Estimated ready time: <strong>{order.estimated_ready_time}</strong></span>
                  </div>
                )}
              </div>

              {/* Step progression */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {steps.map((st, idx) => {
                  const state = getStepStatus(st.key, order.status);
                  return (
                    <div
                      key={st.key}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        state === "completed"
                          ? "bg-emerald-50/70 border-emerald-300 text-emerald-900"
                          : state === "current"
                          ? "bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/30 font-bold animate-pulse-subtle"
                          : "bg-slate-50/60 border-slate-200 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1.5">
                        {state === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : state === "current" ? (
                          <div className="relative">
                            <span className="flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                            </span>
                          </div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300"></div>
                        )}
                      </div>
                      <span className="text-[11px] leading-tight block font-semibold">
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ORDER ITEMS BREAKDOWN */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Order Items
              </h4>

              <div className="bg-slate-50/80 rounded-2xl p-4 divide-y divide-slate-200/60 text-xs">
                {order.items?.map((it) => (
                  <div key={it.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{it.item_name}</span>
                      <span className="text-slate-500 ml-2">× {it.quantity}</span>
                    </div>
                    <span className="font-bold text-slate-800">₹{it.price * it.quantity}</span>
                  </div>
                ))}

                <div className="pt-3 flex justify-between font-extrabold text-sm text-slate-900">
                  <span>Total Paid (Online)</span>
                  <span className="text-emerald-600">₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auto-refreshed live • Last updated: {lastRefreshed.toLocaleTimeString()}</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="tel:+919845011223"
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Call Canteen</span>
                </a>

                <Link
                  to="/menu"
                  className="px-4 py-2 bg-campus-navy text-white font-bold rounded-xl hover:bg-slate-800 transition"
                >
                  Order More Food
                </Link>
              </div>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
}
