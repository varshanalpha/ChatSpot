import React from "react";
import { useNotifications } from "../context/NotificationContext";
import { Bell, CheckCheck, Clock, X, ChefHat, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationModal({ isOpen, onClose }) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-sm">Notifications</h2>
              <p className="text-xs text-slate-500">Live canteen & pickup alerts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.is_read) && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Bell className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm font-medium text-slate-600">No notifications yet</p>
              <p className="text-xs mt-1">You will receive updates here when your food is accepted, cooking, or ready!</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isReady = notif.title.toLowerCase().includes("ready");
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.is_read) markAsRead(notif.id);
                    if (notif.order_id) {
                      navigate(`/track/${notif.order_id}`);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isReady
                      ? "bg-emerald-50/80 border-emerald-300 shadow-sm"
                      : notif.is_read
                      ? "bg-white border-slate-200 opacity-80 hover:opacity-100"
                      : "bg-blue-50/50 border-blue-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isReady
                          ? "bg-emerald-500 text-white animate-bounce"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isReady ? <Sparkles className="w-4 h-4" /> : <ChefHat className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-xs font-bold ${isReady ? "text-emerald-900" : "text-slate-800"}`}>
                          {notif.title}
                        </h4>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${isReady ? "text-emerald-800 font-medium" : "text-slate-600"}`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>Just now</span>
                        {notif.order_id && (
                          <span className="text-emerald-600 font-semibold underline ml-auto">
                            Track Order →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
