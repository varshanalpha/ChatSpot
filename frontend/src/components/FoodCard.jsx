import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Plus, Minus, ShoppingCart, Clock, Check } from "lucide-react";

export default function FoodCard({ item }) {
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const isSoldOut = item.availability === "SOLD_OUT";
  const isLowStock = item.availability === "LOW_STOCK";

  const existingInCart = cartItems.find((i) => i.item.id === item.id);

  const handleAdd = () => {
    if (isSoldOut) return;
    addToCart(item, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isSoldOut
          ? "border-slate-200 opacity-60 grayscale-[40%]"
          : "border-slate-200/90 hover:border-slate-300 hover:shadow-card hover:-translate-y-0.5"
      }`}
    >
      {/* Image container with availability badges */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs p-1 rounded shadow-xs flex items-center justify-center">
          <div
            className={`w-3.5 h-3.5 border rounded-xs flex items-center justify-center ${
              item.is_veg
                ? "border-emerald-600 bg-white"
                : "border-rose-600 bg-white"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                item.is_veg ? "bg-emerald-600" : "bg-rose-600"
              }`}
            />
          </div>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-2.5 right-2.5">
          {isSoldOut ? (
            <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold rounded-full">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 bg-amber-500/90 backdrop-blur-xs text-white text-[11px] font-bold rounded-full shadow-2xs">
              Low Stock ({item.stock_quantity || "Few"} left)
            </span>
          ) : (
            <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-xs text-emerald-700 text-[10px] font-semibold rounded-full border border-emerald-200/60">
              Fresh
            </span>
          )}
        </div>

        {/* Prep time badge */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          <span>{item.preparation_time || 10}m prep</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight">
              {item.name}
            </h3>
            <span className="text-sm md:text-base font-extrabold text-slate-900 shrink-0">
              ₹{item.price}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Action bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Quantity selector */}
          {!isSoldOut ? (
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-l-lg transition"
                disabled={quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-slate-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-r-lg transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-medium italic">Unavailable</span>
          )}

          {/* Add to Cart button */}
          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleAdd}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              isSoldOut
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : justAdded
                ? "bg-emerald-600 text-white"
                : "bg-campus-navy hover:bg-slate-800 text-white hover:shadow-sm active:scale-95"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : existingInCart ? (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add More</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
