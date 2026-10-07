import React, { useState, useEffect } from "react";
import { api } from "../api/client";
import FoodCard from "../components/FoodCard";
import LiveCrowdBadge from "../components/LiveCrowdBadge";
import { useCart } from "../context/CartContext";
import {
  Search,
  SlidersHorizontal,
  Leaf,
  ShoppingBag,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();

  useEffect(() => {
    async function fetchCats() {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (e) {
        console.error(e);
      }
    }
    fetchCats();
  }, []);

  useEffect(() => {
    async function fetchMenu() {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== "all") {
          params.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (vegOnly) {
          params.veg_only = "true";
        }
        const data = await api.getMenu(params);
        setMenuItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, [selectedCategory, searchQuery, vegOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
              Today’s Menu
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Fresh Daily
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Browse campus canteen delights and add them directly to your order tray.
          </p>
        </div>

        {/* Live Canteen Status in menu page */}
        <div className="flex items-center gap-3">
          <LiveCrowdBadge />
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food by name or spices..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs transition"
            />
          </div>

          {/* Dietary Veg-only Toggle */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-xl shadow-2xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-2 text-xs font-bold transition px-2 py-1 rounded-lg ${
                vegOnly
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 border rounded-xs flex items-center justify-center ${
                  vegOnly ? "border-emerald-600 bg-white" : "border-slate-400"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    vegOnly ? "bg-emerald-600" : "bg-slate-400"
                  }`}
                />
              </div>
              <span>Veg Only</span>
            </button>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
              selectedCategory === "all"
                ? "bg-campus-navy text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            All Items
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                selectedCategory === cat.slug
                  ? "bg-campus-navy text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-72 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="h-64 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-400">
          <SlidersHorizontal className="w-10 h-10 mb-2 opacity-30" />
          <h3 className="text-base font-bold text-slate-700">No items match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try clearing your search term or switching the category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setVegOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Mobile Sticky Floating Tray Pill */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden">
          <div
            onClick={() => setIsCartOpen(true)}
            className="bg-campus-navy text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-xs text-slate-950">
                {totalItemsCount}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-300">Your Tray</p>
                <p className="text-sm font-extrabold text-white">₹{subtotal}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <span>View Tray</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
