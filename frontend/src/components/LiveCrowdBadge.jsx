import React, { useState, useEffect } from "react";
import { Users, Clock, AlertCircle } from "lucide-react";
import { api } from "../api/client";

export default function LiveCrowdBadge({ minimal = false }) {
  const [status, setStatus] = useState({
    crowd_level: "MODERATE",
    crowd_label: "Moderate Crowd",
    crowd_color: "yellow",
    active_orders_count: 8,
    estimated_wait_time_minutes: 12,
  });
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadStatus() {
      try {
        const data = await api.getCanteenStatus();
        if (isMounted) setStatus(data);
      } catch (err) {
        // Fallback default
      }
    }
    loadStatus();
    const interval = setInterval(loadStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const colorStyles = {
    green: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      pulse: "bg-emerald-400",
    },
    yellow: {
      bg: "bg-amber-50 text-amber-800 border-amber-200",
      dot: "bg-amber-500",
      pulse: "bg-amber-400",
    },
    red: {
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500",
      pulse: "bg-rose-400",
    },
  }[status.crowd_color] || {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    pulse: "bg-emerald-400",
  };

  if (minimal) {
    return (
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${colorStyles.bg}`}>
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorStyles.pulse}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${colorStyles.dot}`}></span>
        </span>
        <span>{status.crowd_label}</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:shadow-sm ${colorStyles.bg}`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorStyles.pulse}`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colorStyles.dot}`}></span>
        </span>
        <span>Live Canteen: {status.crowd_label}</span>
        <Clock className="w-3.5 h-3.5 opacity-70 ml-0.5" />
        <span className="font-mono">~{status.estimated_wait_time_minutes}m</span>
      </button>

      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white border border-slate-200 rounded-xl shadow-lg z-50 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-150">
          <div className="font-semibold text-slate-900 mb-1 flex items-center justify-between">
            <span>Live Kitchen Workload</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
              Live
            </span>
          </div>
          <p className="text-slate-600 mb-2 leading-relaxed">
            Calculated from active orders in kitchen to help you skip long waiting queues.
          </p>
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-slate-600">
              <span>Active Orders in Prep:</span>
              <span className="font-semibold text-slate-900">{status.active_orders_count || 8} orders</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Current Average Prep:</span>
              <span className="font-semibold text-emerald-600">~{status.estimated_wait_time_minutes} mins</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
