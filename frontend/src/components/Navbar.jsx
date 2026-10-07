import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNotifications } from "../context/NotificationContext";
import LiveCrowdBadge from "./LiveCrowdBadge";
import NotificationModal from "./NotificationModal";
import {
  UtensilsCrossed,
  ShoppingBag,
  Bell,
  User,
  Clock,
  LayoutDashboard,
  Menu as MenuIcon,
  X,
  LogOut,
  ChevronDown
} from "lucide-react";

export default function Navbar() {
  const { user, role, isStaff, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-campus-navy flex items-center justify-center text-emerald-400 shadow-sm group-hover:scale-105 transition">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-1">
                    ChatSpot
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </span>
                  <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                    Order Smart. Skip the Crowd.
                  </p>
                </div>
              </Link>

              {/* Live Crowd Badge for Student / Campus users */}
              <div className="hidden lg:block">
                <LiveCrowdBadge />
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {!isStaff ? (
                <>
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      isActive("/")
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/menu"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      isActive("/menu")
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Today's Menu
                  </Link>
                  <Link
                    to="/orders"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      isActive("/orders")
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/track"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      location.pathname.startsWith("/track")
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Track Live
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/staff"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                      isActive("/staff")
                        ? "text-amber-800 bg-amber-50 border border-amber-200"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-600" />
                    Canteen Kitchen Board
                  </Link>
                  <Link
                    to="/menu"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Menu View
                  </Link>
                </>
              )}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Bell */}
              <button
                type="button"
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Cart Drawer Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-sm transition border border-emerald-200/70"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Tray</span>
                <span className="bg-emerald-600 text-white text-xs px-1.5 py-0.2 rounded-full font-bold">
                  {totalItemsCount}
                </span>
              </button>

              {/* Profile link */}
              <Link
                to="/profile"
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                title="Student Profile"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
              </Link>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 md:hidden"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <div className="py-2 mb-2 border-b border-slate-100">
              <LiveCrowdBadge />
            </div>

            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Today's Menu
            </Link>
            <Link
              to="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              My Orders
            </Link>
            <Link
              to="/track"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Track Order Live
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              My Profile ({user?.name || "Student"})
            </Link>
            {isStaff && (
              <Link
                to="/staff"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-700 bg-amber-50"
              >
                👨‍🍳 Canteen Staff Board
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Slide-over Notifications */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </>
  );
}
