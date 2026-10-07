import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Shield,
  Clock,
  HelpCircle,
  LogOut,
  Bell,
  ChefHat,
  CreditCard,
  CheckCircle2
} from "lucide-react";

export default function ProfilePage() {
  const { user, role, logout, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [supportMessage, setSupportMessage] = useState("");
  const [showSupportSuccess, setShowSupportSuccess] = useState(false);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (supportMessage.trim()) {
      setShowSupportSuccess(true);
      setSupportMessage("");
      setTimeout(() => setShowSupportSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Campus identification and canteen preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-6">
            
            {/* Header info */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-campus-navy text-emerald-400 font-extrabold text-2xl flex items-center justify-center shadow-sm">
                {user?.name ? user.name[0].toUpperCase() : "S"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{user?.name || "Student"}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                    {role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{user?.student_id || "CS-2023-042"}</p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </span>
                <p className="font-bold text-slate-800 truncate">{user?.email || "student@campus.edu"}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </span>
                <p className="font-bold text-slate-800">{user?.phone || "+91 98765 43210"}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> Department
                </span>
                <p className="font-bold text-slate-800">{user?.department || "Computer Science"}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> Academic Year
                </span>
                <p className="font-bold text-slate-800">{user?.year || "3rd Year"}</p>
              </div>
            </div>

            {/* Persona Switch Options */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Switch Test Role:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => loginDemo("STUDENT")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                    role === "STUDENT"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginDemo("STAFF");
                    navigate("/staff");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                    role === "STAFF"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Canteen Staff</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginDemo("ADMIN");
                    navigate("/staff");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                    role === "ADMIN"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Menu Shortcuts & Help */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-2 text-xs">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
              Quick Shortcuts
            </h3>

            <Link
              to="/orders"
              className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 flex items-center justify-between transition group font-semibold text-slate-700"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>My Orders History</span>
              </div>
              <span className="text-slate-400 group-hover:translate-x-1 transition">→</span>
            </Link>

            <Link
              to="/menu"
              className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 flex items-center justify-between transition group font-semibold text-slate-700"
            >
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-blue-600" />
                <span>Today's Menu</span>
              </div>
              <span className="text-slate-400 group-hover:translate-x-1 transition">→</span>
            </Link>

            <button
              onClick={() => logout()}
              className="w-full p-3 rounded-xl border border-rose-100 hover:bg-rose-50 text-rose-600 flex items-center justify-between transition font-semibold"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </div>
              <span>→</span>
            </button>
          </div>

          {/* Help & Support Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Campus Canteen Support</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Facing issues with tokens, dietary customization, or refunds? Contact counter helpline directly:
            </p>
            <div className="p-2.5 bg-slate-50 rounded-xl font-mono text-[11px] text-slate-800 flex justify-between">
              <span>Counter Hotline:</span>
              <strong>+91 98450 11223</strong>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-2 pt-2 border-t border-slate-100">
              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Ask canteen staff a question..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={2}
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition"
              >
                Send Message to Canteen
              </button>
            </form>

            {showSupportSuccess && (
              <div className="p-2 bg-emerald-50 text-emerald-800 text-[11px] rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Message received! Canteen staff will attend to you.</span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
