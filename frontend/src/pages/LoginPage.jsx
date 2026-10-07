import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  UtensilsCrossed,
  User,
  Lock,
  Mail,
  Phone,
  Building,
  GraduationCap,
  ArrowRight,
  ChefHat,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export default function LoginPage() {
  const { login, register, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    student_id: "",
    phone: "",
    department: "Computer Science",
    year: "3rd Year",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    await loginDemo(role);
    if (role === "STAFF" || role === "ADMIN") {
      navigate("/staff");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-card space-y-6">
        
        {/* Logo and title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-campus-navy text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">
            {isRegister ? "Join ChatSpot" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister
              ? "Create your college canteen digital ordering account"
              : "Login using your campus email or credentials"}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isRegister && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    placeholder="CS-2023-042"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Campus Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@campus.edu"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-campus-navy hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 pt-2"
          >
            <span>{isRegister ? "Create Account" : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            {isRegister
              ? "Already have an account? Sign in here"
              : "Don't have an account? Sign up for free"}
          </button>
        </div>

        {/* 1-Click Instant Persona Sign-in for seamless demo testing */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 block text-center uppercase tracking-wider">
            1-Click Demo Login:
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo("STUDENT")}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-[11px] border border-emerald-200 transition text-center"
            >
              🎓 Student
            </button>
            <button
              onClick={() => handleQuickDemo("STAFF")}
              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl font-bold text-[11px] border border-amber-200 transition text-center"
            >
              👨‍🍳 Canteen Staff
            </button>
            <button
              onClick={() => handleQuickDemo("ADMIN")}
              className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl font-bold text-[11px] border border-indigo-200 transition text-center"
            >
              📊 Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
