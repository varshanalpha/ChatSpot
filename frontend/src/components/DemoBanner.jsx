import React from "react";
import { useAuth } from "../context/AuthContext";
import { User, ChefHat, ShieldAlert, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DemoBanner() {
  const { user, role, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = async (newRole) => {
    await loginDemo(newRole);
    if (newRole === "STAFF" || newRole === "ADMIN") {
      navigate("/staff");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="bg-campus-navy text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ChatSpot Demo
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">
            Logged in as <strong className="text-white">{user?.name || "Student"}</strong> ({role})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Quick Switch Persona:</span>
          
          <button
            onClick={() => handleSwitch("STUDENT")}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
              role === "STUDENT"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <User className="w-3 h-3" />
            <span>Student</span>
            {role === "STUDENT" && <Check className="w-2.5 h-2.5 ml-0.5" />}
          </button>

          <button
            onClick={() => handleSwitch("STAFF")}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
              role === "STAFF"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <ChefHat className="w-3 h-3" />
            <span>Canteen Staff</span>
            {role === "STAFF" && <Check className="w-2.5 h-2.5 ml-0.5" />}
          </button>

          <button
            onClick={() => handleSwitch("ADMIN")}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
              role === "ADMIN"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Admin</span>
            {role === "ADMIN" && <Check className="w-2.5 h-2.5 ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
