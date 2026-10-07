import React from "react";
import { useCart } from "../context/CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    estimatedPrepMinutes,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-sm">Your Campus Cart</h2>
              <p className="text-xs text-slate-500">{cartItems.length} items selected</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-base font-semibold text-slate-700">Your tray is empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Browse today's canteen menu and pick your favourites before heading to counter.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/menu");
                }}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cartItems.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center gap-3 hover:border-slate-300 transition"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover bg-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                        item.is_veg ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    ₹{item.price} each
                  </p>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">
                    ₹{item.price * quantity}
                  </p>
                </div>

                {/* Stepper */}
                <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-2xs">
                  <button
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    className="p-1 hover:bg-slate-100 text-slate-600 rounded-l-lg transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    className="p-1 hover:bg-slate-100 text-slate-600 rounded-r-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-slate-300 hover:text-rose-500 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white space-y-3">
            {/* Dynamic Estimated preparation time */}
            <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 font-medium">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Estimated preparation time: <strong>{estimatedPrepMinutes}–{estimatedPrepMinutes + 5} minutes</strong>
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Campus Platform Fee</span>
                <span className="text-emerald-600 font-semibold">FREE (₹0)</span>
              </div>
              <div className="border-t border-slate-100 pt-1.5 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-600 text-base">₹{subtotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
