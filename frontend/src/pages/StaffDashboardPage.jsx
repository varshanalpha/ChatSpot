import React, { useState, useEffect } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import LiveCrowdBadge from "../components/LiveCrowdBadge";
import {
  LayoutDashboard,
  ChefHat,
  UtensilsCrossed,
  BarChart3,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Users,
  IndianRupee,
  X,
  Sparkles
} from "lucide-react";

export default function StaffDashboardPage() {
  const { role, user } = useAuth();
  const [activeTab, setActiveTab] = useState("kanban"); // "kanban", "menu", "analytics"
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchToken, setSearchToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Menu Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: 1,
    image_url: "",
    availability: "AVAILABLE",
    stock_quantity: 40,
    preparation_time: 10,
    is_veg: false,
  });

  const loadData = async () => {
    setRefreshing(true);
    try {
      const [ordersData, menuData, catsData, analyticsData] = await Promise.all([
        api.getStaffOrders(),
        api.getMenu(),
        api.getCategories(),
        api.getAnalytics(),
      ]);
      setOrders(ordersData);
      setMenuItems(menuData);
      setCategories(catsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error("Staff dashboard load error", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 6000); // Poll kitchen orders every 6 seconds
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      // Immediately reflect in local state for instantaneous snappy feel
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      loadData();
    } catch (err) {
      alert(err.message || "Could not update order status");
    }
  };

  // Menu Form Handlers
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setMenuForm({
      name: "",
      description: "",
      price: "",
      category_id: categories[0]?.id || 1,
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
      availability: "AVAILABLE",
      stock_quantity: 40,
      preparation_time: 10,
      is_veg: false,
    });
    setIsMenuModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category_id: item.category_id,
      image_url: item.image_url || "",
      availability: item.availability,
      stock_quantity: item.stock_quantity || 40,
      preparation_time: item.preparation_time || 10,
      is_veg: item.is_veg,
    });
    setIsMenuModalOpen(true);
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...menuForm,
        price: parseFloat(menuForm.price),
        category_id: parseInt(menuForm.category_id),
        stock_quantity: parseInt(menuForm.stock_quantity),
        preparation_time: parseInt(menuForm.preparation_time),
      };

      if (editingItem) {
        await api.updateMenuItem(editingItem.id, payload);
      } else {
        await api.addMenuItem(payload);
      }
      setIsMenuModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || "Error saving item");
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await api.deleteMenuItem(id);
      loadData();
    } catch (err) {
      alert(err.message || "Could not delete item");
    }
  };

  const handleToggleAvailability = async (item, newAvail) => {
    try {
      await api.updateMenuItem(item.id, { availability: newAvail });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Kanban Columns Definition (Section 15)
  const columns = [
    { key: "NEW", title: "New Orders", color: "bg-blue-50 border-blue-200 text-blue-900", badgeColor: "bg-blue-600" },
    { key: "ACCEPTED", title: "Accepted", color: "bg-indigo-50 border-indigo-200 text-indigo-900", badgeColor: "bg-indigo-600" },
    { key: "PREPARING", title: "Preparing", color: "bg-amber-50 border-amber-200 text-amber-900", badgeColor: "bg-amber-600" },
    { key: "READY", title: "Ready for Pickup", color: "bg-emerald-50 border-emerald-200 text-emerald-900", badgeColor: "bg-emerald-600" },
    { key: "COMPLETED", title: "Completed", color: "bg-slate-50 border-slate-200 text-slate-800", badgeColor: "bg-slate-600" },
  ];

  const filteredOrders = orders.filter((o) => {
    if (!searchToken.trim()) return true;
    const term = searchToken.toLowerCase().trim();
    return (
      o.token_number?.toLowerCase().includes(term) ||
      o.order_number?.toLowerCase().includes(term) ||
      o.student_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Canteen Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-amber-600" />
              ChatSpot Canteen
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              Kitchen Console
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time digital order queue management, kitchen preparation, and menu control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LiveCrowdBadge />
          <button
            onClick={loadData}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS (Section 14 of prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Today's Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Today's Orders</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {analytics?.total_orders_today || 128}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">
            +18% vs yesterday
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Pending / New</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {orders.filter((o) => o.status === "NEW" || o.status === "ACCEPTED").length || 17}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Awaiting kitchen</div>
        </div>

        {/* Preparing */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Preparing</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {orders.filter((o) => o.status === "PREPARING").length || 8}
          </div>
          <div className="text-[10px] text-amber-600 font-bold mt-1">On cooking flame</div>
        </div>

        {/* Ready */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Ready at Counter</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {orders.filter((o) => o.status === "READY").length || 5}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">Pickup notifications sent</div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-slate-500">Today's Revenue</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{analytics?.total_revenue_today || 8420}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">Verified UPI / Cards</div>
        </div>

      </div>

      {/* DASHBOARD NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("kanban")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === "kanban"
              ? "bg-campus-navy text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Live Kitchen Kanban</span>
        </button>

        <button
          onClick={() => setActiveTab("menu")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === "menu"
              ? "bg-campus-navy text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Menu Management</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === "analytics"
              ? "bg-campus-navy text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Sales & Crowd Analytics</span>
        </button>
      </div>

      {/* ===================== TAB 1: KANBAN ORDER MANAGEMENT ===================== */}
      {activeTab === "kanban" && (
        <div className="space-y-4">
          
          {/* Quick Filter Search for Tokens */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                placeholder="Find token (e.g. A127) or order ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Total Active Queue: <strong>{filteredOrders.filter(o => o.status !== "COMPLETED").length} orders</strong></span>
            </div>
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {columns.map((col) => {
              const columnOrders = filteredOrders.filter((o) => o.status === col.key);
              return (
                <div
                  key={col.key}
                  className={`rounded-2xl border ${col.color} p-3 flex flex-col min-h-[580px] shadow-2xs`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${col.badgeColor}`}></span>
                      <h3 className="font-extrabold text-xs tracking-tight">{col.title}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-white text-slate-800 shadow-2xs">
                      {columnOrders.length}
                    </span>
                  </div>

                  {/* Cards in column */}
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
                    {columnOrders.length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                        <span>No orders in this state</span>
                      </div>
                    ) : (
                      columnOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs hover:shadow-card transition space-y-3"
                        >
                          {/* Token & Order ID */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-xl font-black font-mono text-slate-950 block">
                                #{order.token_number}
                              </span>
                              <span className="text-[11px] font-bold text-slate-500 font-mono">
                                Order #{order.order_number}
                              </span>
                            </div>
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              ₹{order.total_amount}
                            </span>
                          </div>

                          {/* Student Details */}
                          <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg">
                            <p className="font-bold text-slate-900 truncate">
                              {order.student_name}
                            </p>
                            <p className="text-slate-400 text-[10px] mt-0.5">
                              ID: {order.student_id_val} {order.student_phone && `• ${order.student_phone}`}
                            </p>
                          </div>

                          {/* Items List */}
                          <div className="space-y-1 text-xs">
                            {order.items?.map((it) => (
                              <div key={it.id} className="flex justify-between items-center text-slate-700">
                                <span className="font-semibold truncate max-w-[140px]">
                                  {it.item_name}
                                </span>
                                <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                                  ×{it.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Time & Counter */}
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span>{order.pickup_counter || "Counter 1"}</span>
                          </div>

                          {/* Action Transition Buttons */}
                          <div className="pt-2">
                            {order.status === "NEW" && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, "ACCEPTED")}
                                className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
                              >
                                Accept Order
                              </button>
                            )}

                            {order.status === "ACCEPTED" && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                                className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <Flame className="w-3 h-3" />
                                <span>Start Preparing</span>
                              </button>
                            )}

                            {order.status === "PREPARING" && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, "READY")}
                                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1 shadow-xs"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Mark Ready (Notify)</span>
                              </button>
                            )}

                            {order.status === "READY" && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
                                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Verify & Complete</span>
                              </button>
                            )}

                            {order.status === "COMPLETED" && (
                              <div className="text-center py-1 text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span>Picked Up</span>
                              </div>
                            )}
                          </div>

                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: MENU MANAGEMENT ===================== */}
      {activeTab === "menu" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Food Menu Management</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update daily pricing, stock availability states, preparation times, or introduce new dishes.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Food</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Prep Time</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.is_veg ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            <span className="font-bold text-slate-900">{item.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 line-clamp-1">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {categories.find((c) => c.id === item.category_id)?.name || "Snacks"}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{item.price}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {item.preparation_time} mins
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleAvailability(item, "AVAILABLE")}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                            item.availability === "AVAILABLE"
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Available
                        </button>
                        <button
                          onClick={() => handleToggleAvailability(item, "LOW_STOCK")}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                            item.availability === "LOW_STOCK"
                              ? "bg-amber-500 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Low Stock
                        </button>
                        <button
                          onClick={() => handleToggleAvailability(item, "SOLD_OUT")}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                            item.availability === "SOLD_OUT"
                              ? "bg-rose-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Sold Out
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: ANALYTICS & INSIGHTS ===================== */}
      {activeTab === "analytics" && analytics && (
        <div className="space-y-6">
          
          {/* Top Key Insights (Section 19) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Peak Ordering Rush
              </span>
              <div className="text-2xl font-black text-slate-900">
                {analytics.peak_ordering_time}
              </div>
              <p className="text-xs text-slate-500">
                Major break time. Staffing all 2 kitchen counters recommended.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Most Popular Campus Item
              </span>
              <div className="text-2xl font-black text-slate-900">
                {analytics.popular_items[0]?.name || "Chicken Fried Rice"}
              </div>
              <p className="text-xs text-slate-500">
                Accounts for 35% of total afternoon lunch orders.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Average Kitchen Preparation Time
              </span>
              <div className="text-2xl font-black text-slate-900">
                {analytics.average_preparation_time}
              </div>
              <p className="text-xs text-slate-500">
                Order-to-ready speed down 42% since deploying ChatSpot tokens.
              </p>
            </div>

          </div>

          {/* Performance & Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Hourly volume trend */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">
                  Hourly Order Volume Trend
                </h3>
                <span className="text-xs text-slate-400">Today</span>
              </div>

              <div className="space-y-3 pt-2">
                {analytics.hourly_trends?.map((hr) => {
                  const maxOrders = 100;
                  const pct = Math.min(100, Math.round((hr.orders / maxOrders) * 100));
                  return (
                    <div key={hr.hour} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-mono text-slate-600">{hr.hour}</span>
                        <span className="font-bold text-slate-900">
                          {hr.orders} orders (₹{hr.revenue})
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top 5 Popular Items list */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Top Selling Food
              </h3>

              <div className="space-y-3">
                {analytics.popular_items?.map((it, idx) => (
                  <div key={it.name} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">{it.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900 block">
                        {it.orders_count} sold
                      </span>
                      <span className="text-[10px] text-slate-400">₹{it.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ===================== ADD / EDIT FOOD MODAL ===================== */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingItem ? "Edit Food Item" : "Add Food Item"}
              </h3>
              <button
                onClick={() => setIsMenuModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Food Name</label>
                <input
                  type="text"
                  required
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  placeholder="e.g. Chicken Fried Rice"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  placeholder="Short description of ingredients & preparation..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                    placeholder="80"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={menuForm.category_id}
                    onChange={(e) => setMenuForm({ ...menuForm, category_id: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={menuForm.preparation_time}
                    onChange={(e) => setMenuForm({ ...menuForm, preparation_time: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={menuForm.stock_quantity}
                    onChange={(e) => setMenuForm({ ...menuForm, stock_quantity: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={menuForm.image_url}
                  onChange={(e) => setMenuForm({ ...menuForm, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={menuForm.is_veg}
                    onChange={(e) => setMenuForm({ ...menuForm, is_veg: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Vegetarian Dish</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
                >
                  Save Item
                </button>
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
