import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import FoodCard from "../components/FoodCard";
import LiveCrowdBadge from "../components/LiveCrowdBadge";
import {
  ArrowRight,
  Smartphone,
  CreditCard,
  ChefHat,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Users,
  ShieldCheck,
  Flame,
  BellRing
} from "lucide-react";

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenInput, setTokenInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await api.getMenu();
        // Pick top items
        setFeaturedItems(data.slice(0, 4));
      } catch (e) {
        console.error("Failed to load featured menu", e);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      navigate(`/track/${tokenInput.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-campus-navy to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-emerald-400">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Smart College Canteen Queue Platform</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Order Smart. <br />
                <span className="text-emerald-400">Skip the Crowd.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Skip the queue. Order your favourite campus food, pay online, and get notified when your order is ready. Your campus food, without the queue.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-base rounded-xl border border-slate-700 transition flex items-center justify-center"
                >
                  View Menu
                </Link>
              </div>

              {/* Quick Token Search Box */}
              <div className="pt-4 max-w-md mx-auto lg:mx-0">
                <form
                  onSubmit={handleTrackSubmit}
                  className="flex items-center gap-2 p-1.5 bg-slate-800/70 border border-slate-700 rounded-xl"
                >
                  <Search className="w-4 h-4 text-slate-400 ml-2" />
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Have a token? (e.g. A127 or CS1024)"
                    className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none px-2"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
                  >
                    Track
                  </button>
                </form>
              </div>

              {/* Live Crowd Info Pill on Hero */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-medium">Kitchen Live</span>
                </div>
                <span>•</span>
                <span>Avg. wait ~10–12 mins</span>
                <span>•</span>
                <span>Pickup at Counter 1 & 2</span>
              </div>
            </div>

            {/* Right Column: Interactive Process Diagram */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
                
                <div className="flex items-center justify-between pb-6 border-b border-slate-700/60 mb-6">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                      Zero Queue Lifecycle
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      How You Skip The Rush
                    </h3>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                    Live Flow
                  </div>
                </div>

                {/* Vertical Process Steps */}
                <div className="space-y-4 relative">
                  
                  {/* Step 1 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">Student on Phone</h4>
                        <span className="text-[10px] text-slate-400">Classroom / Hostel</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Browse live menu & select meals</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">Instant Payment</h4>
                        <span className="text-[10px] text-emerald-400 font-semibold">Token Generated</span>
                      </div>
                      <p className="text-[11px] text-slate-400">UPI / Campus Wallet • Token #A127</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">Canteen Prepares</h4>
                        <span className="text-[10px] text-amber-400 font-semibold">Live Kitchen Queue</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Order appears instantly on kitchen Kanban</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 shadow-xs">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-emerald-300">Ready & Instant Pickup</h4>
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                          TOKEN A127
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-200/80">Get notified → Walk over → Show token</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW CHATSPOT WORKS (4 SIMPLE STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Simple & Transparent
          </span>
          <h2 className="font-display text-3xl font-bold text-slate-900 mt-3">
            How ChatSpot Works
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            No more waiting around counter crowds. Four straightforward steps to a stress-free meal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 01 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-card transition duration-200 relative group">
            <div className="text-4xl font-black font-display text-slate-200 group-hover:text-emerald-500/30 transition mb-3">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900">Browse</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Explore today's available canteen menu with live stock updates and price transparency.
            </p>
          </div>

          {/* Step 02 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-card transition duration-200 relative group">
            <div className="text-4xl font-black font-display text-slate-200 group-hover:text-emerald-500/30 transition mb-3">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900">Order & Pay</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Add your favourite items and complete payment securely via UPI or student campus wallet.
            </p>
          </div>

          {/* Step 03 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-card transition duration-200 relative group">
            <div className="text-4xl font-black font-display text-slate-200 group-hover:text-amber-500/30 transition mb-3">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900">We Prepare</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Your order is instantly queued in the kitchen. Relax in class or library while cooks prepare it fresh.
            </p>
          </div>

          {/* Step 04 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-card transition duration-200 relative group">
            <div className="text-4xl font-black font-display text-slate-200 group-hover:text-emerald-500/30 transition mb-3">
              04
            </div>
            <h3 className="text-lg font-bold text-slate-900">Pick Up</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Get notified when your food is ready and collect it at the pickup counter using your unique token.
            </p>
          </div>

        </div>
      </section>

      {/* VALUE PROPOSITION GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/70 border border-slate-200 rounded-3xl p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">No Queue</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Order before you reach the counter. Eliminate 20-minute standing queues during lunch breaks.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Live Tracking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Know exactly when your food is cooking and ready. Track progress in real time.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Easy Payment</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pay securely online with verified zero pricing errors or cash change hassles.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Faster Pickup</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flash your high-visibility token at Counter 1 or 2 and grab your meal in under 30 seconds.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* TODAY'S CAMPUS FAVORITES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 flex items-center gap-1">
              <Flame className="w-4 h-4" />
              Most Ordered
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Today's Campus Favorites
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Popular food items with students right now
            </p>
          </div>

          <Link
            to="/menu"
            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>See Full Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
