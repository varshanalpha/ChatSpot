import React from "react";
import { UtensilsCrossed, Clock, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-campus-navy text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                ChatSpot
              </span>
            </div>
            <p className="text-sm font-semibold text-emerald-400">
              “Order Smart. Skip the Crowd.”
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Campus canteen digital queue-management platform. Order your meals before leaving the classroom, monitor preparation live, and collect seamlessly using your unique token.
            </p>
          </div>

          {/* Canteen Hours & Pickup */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Canteen Info
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Open: 08:00 AM – 08:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Central Campus Food Court, Counter 1 & 2</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Kitchen Helpline: +91 98450 11223</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/menu" className="hover:text-emerald-400 transition">Today's Menu</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-emerald-400 transition">Order History</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-emerald-400 transition">Live Token Tracker</Link>
              </li>
              <li>
                <Link to="/staff" className="hover:text-amber-400 transition">Canteen Staff Dashboard</Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ChatSpot Campus Technologies. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Digital Queue System • Designed for zero wait times</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
