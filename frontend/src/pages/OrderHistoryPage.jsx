import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";
import {
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle2,
  RotateCcw,
  Search,
  ExternalLink
} from "lucide-react";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await api.getMyOrders();
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleReorder = async (order) => {
    try {
      const menu = await api.getMenu();
      order.items?.forEach((it) => {
        const matched = menu.find((m) => m.id === it.food_item_id);
        if (matched) {
          addToCart(matched, it.quantity);
        }
      });
      setIsCartOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "READY":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse";
      case "PREPARING":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View your campus meal history and track active preparation tokens
          </p>
        </div>

        <Link
          to="/menu"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Food</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 bg-white border border-slate-200 rounded-3xl text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No Orders Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed any food orders yet. Check out today's canteen specials!
          </p>
          <div className="pt-2">
            <Link
              to="/menu"
              className="px-5 py-2.5 bg-campus-navy text-white text-xs font-bold rounded-xl"
            >
              Browse Today’s Menu
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-card transition duration-150 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-slate-900 text-white rounded-lg font-mono font-bold text-sm">
                    {o.token_number}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Order #{o.order_number}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {new Date(o.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadge(
                      o.status
                    )}`}
                  >
                    {o.status.replace("_", " ")}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 sm:ml-2">
                    ₹{o.total_amount}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-1 text-xs text-slate-600">
                {o.items?.map((it) => (
                  <div key={it.id} className="flex justify-between items-center">
                    <span>
                      {it.item_name} <span className="text-slate-400 font-medium">× {it.quantity}</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                      ₹{it.price * it.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => handleReorder(o)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reorder Items</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/track/${o.order_number}`)}
                  className="px-3.5 py-1.5 bg-campus-navy hover:bg-slate-800 text-white font-bold rounded-lg shadow-2xs transition flex items-center gap-1.5"
                >
                  <span>Track Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
