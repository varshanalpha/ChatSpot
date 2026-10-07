import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider, useNotifications } from "./context/NotificationContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DemoBanner from "./components/DemoBanner";
import CartDrawer from "./components/CartDrawer";

// Pages
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import LoginPage from "./pages/LoginPage";

import { Sparkles, X, ArrowRight } from "lucide-react";

// In-App Toast notification banner when an order is ready
function OrderReadyToastBanner() {
  const { activeToast, dismissToast } = useNotifications();

  if (!activeToast) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-2xl border border-emerald-400/40 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-black tracking-wide uppercase text-emerald-200">
            {activeToast.title}
          </h4>
          <p className="text-xs font-semibold text-white mt-0.5 leading-snug">
            {activeToast.message}
          </p>
          {activeToast.order_id && (
            <Link
              to={`/track/${activeToast.order_id}`}
              onClick={dismissToast}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-100 hover:text-white mt-2 underline"
            >
              <span>View Token & Collect Food</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        <button
          onClick={dismissToast}
          className="p-1 rounded-lg text-emerald-200 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <DemoBanner />
      <Navbar />
      <OrderReadyToastBanner />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track" element={<OrderTrackingPage />} />
          <Route path="/track/:id" element={<OrderTrackingPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/staff" element={<StaffDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <MainLayout />
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}
